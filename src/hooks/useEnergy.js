import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import { API_URL } from '../config/api';

const ENERGY_STORAGE_KEY = 'user_energy_data';
const MAX_ENERGY = 10;
const REGEN_TIME_MS = 3 * 60 * 1000; // 3 minutes per 1 energy

export function useEnergy() {
  const [energy, setEnergy] = useState(2);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  // Check Premium against local storage & backend DB
  const checkPremiumActive = useCallback(async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('user_data');
      const userData = userDataStr ? JSON.parse(userDataStr) : null;
      const userId = userData?.id || userData?.customId;

      if (userId) {
        // Query backend for real DB status
        try {
          const res = await fetch(`${API_URL}/admin/users`);
          if (res.ok) {
            const allUsers = await res.json();
            const me = allUsers.find(u => u.id === userId || u.customId === userId || u.email === userData.email);
            if (me) {
              if (me.premiumExpiresAt) {
                const expTime = new Date(me.premiumExpiresAt).getTime();
                if (!isNaN(expTime) && Date.now() < expTime) {
                  await AsyncStorage.setItem('user_premium_expires_at', expTime.toString());
                  setIsPremium(true);
                  return true;
                }
              }
              // If backend DB shows no premium, clear local storage
              await AsyncStorage.removeItem('user_premium_expires_at');
              setIsPremium(false);
              return false;
            }
          }
        } catch (err) {}
      }

      const expStr = await AsyncStorage.getItem('user_premium_expires_at');
      if (expStr) {
        const expTime = parseInt(expStr, 10);
        if (!isNaN(expTime) && Date.now() < expTime) {
          setIsPremium(true);
          return true;
        }
      }
    } catch (e) {}
    setIsPremium(false);
    return false;
  }, []);

  // Calculate & Refresh Energy
  const calculateEnergy = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem(ENERGY_STORAGE_KEY);
      const now = Date.now();

      if (!storedData) {
        // Initial setup for new user: 2 energy
        const initialData = { energy: 2, lastUpdated: now };
        await AsyncStorage.setItem(ENERGY_STORAGE_KEY, JSON.stringify(initialData));
        setEnergy(2);
        setTimeRemaining(REGEN_TIME_MS / 1000);
      } else {
        const parsed = JSON.parse(storedData);
        let currentVal = typeof parsed.energy === 'number' ? parsed.energy : 2;
        let lastUpdated = parsed.lastUpdated || now;

        if (currentVal < MAX_ENERGY) {
          const diffMs = now - lastUpdated;
          const energyToAdd = Math.floor(diffMs / REGEN_TIME_MS);

          if (energyToAdd > 0) {
            currentVal = Math.min(MAX_ENERGY, currentVal + energyToAdd);
            lastUpdated = lastUpdated + (energyToAdd * REGEN_TIME_MS);
            if (currentVal >= MAX_ENERGY) {
              lastUpdated = now;
            }
            await AsyncStorage.setItem(ENERGY_STORAGE_KEY, JSON.stringify({ energy: currentVal, lastUpdated }));
          }

          setEnergy(currentVal);

          if (currentVal < MAX_ENERGY) {
            const remainder = (now - lastUpdated) % REGEN_TIME_MS;
            const secondsLeft = Math.max(0, Math.floor((REGEN_TIME_MS - remainder) / 1000));
            setTimeRemaining(secondsLeft);
          } else {
            setTimeRemaining(0);
          }
        } else {
          setEnergy(MAX_ENERGY);
          setTimeRemaining(0);
        }
      }
    } catch (e) {
      console.error('Energy calc error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      calculateEnergy();
      checkPremiumActive();
    }, [calculateEnergy, checkPremiumActive])
  );

  useEffect(() => {
    calculateEnergy();
    checkPremiumActive();

    // Real-time socket listener for admin revoking premium
    let socket;
    try {
      socket = io(API_URL, { transports: ['websocket'] });
      socket.on('premium_revoked', async (data) => {
        try {
          const userDataStr = await AsyncStorage.getItem('user_data');
          const userData = userDataStr ? JSON.parse(userDataStr) : null;
          
          const isTarget = !data.userId || !userData || 
            data.userId === userData.id || 
            data.customId === userData.customId ||
            data.userId === userData.customId;

          if (isTarget) {
            await AsyncStorage.removeItem('user_premium_expires_at');
            setIsPremium(false);
            calculateEnergy();
          }
        } catch (e) {}
      });
    } catch (e) {}

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        calculateEnergy();
        checkPremiumActive();
      }
    });

    return () => {
      if (socket) {
        socket.off('premium_revoked');
        socket.disconnect();
      }
      subscription.remove();
    };
  }, [calculateEnergy, checkPremiumActive]);

  // Timer Tick
  useEffect(() => {
    if (energy >= MAX_ENERGY || isLoading) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          calculateEnergy();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [energy, isLoading, calculateEnergy]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Consume Energy Function
  const consumeEnergy = async (amount) => {
    const hasPremium = await checkPremiumActive();
    if (hasPremium) {
      // Premium is active! Unlimited energy during premium duration.
      return true;
    }

    try {
      const storedData = await AsyncStorage.getItem(ENERGY_STORAGE_KEY);
      const now = Date.now();
      let currentVal = energy;
      let lastUpdated = now;

      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (typeof parsed.energy === 'number') currentVal = parsed.energy;
        if (parsed.lastUpdated) lastUpdated = parsed.lastUpdated;
      }

      // Deduct energy
      const newVal = Math.max(0, currentVal - amount);
      const newLastUpdated = currentVal >= MAX_ENERGY ? now : lastUpdated;

      await AsyncStorage.setItem(ENERGY_STORAGE_KEY, JSON.stringify({ energy: newVal, lastUpdated: newLastUpdated }));
      setEnergy(newVal);
      if (newVal < MAX_ENERGY) {
        setTimeRemaining(REGEN_TIME_MS / 1000);
      }
      return true;
    } catch (e) {
      console.error('consumeEnergy error:', e);
    }
    return true;
  };

  const addEnergy = async (amount) => {
    const now = Date.now();
    const newEnergy = Math.min(MAX_ENERGY, energy + amount);
    await AsyncStorage.setItem(ENERGY_STORAGE_KEY, JSON.stringify({ energy: newEnergy, lastUpdated: now }));
    setEnergy(newEnergy);
    calculateEnergy();
  };

  return {
    energy,
    maxEnergy: MAX_ENERGY,
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isLoading,
    isPremium,
    consumeEnergy,
    addEnergy,
    checkPremiumActive
  };
}
