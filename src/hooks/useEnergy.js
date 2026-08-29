import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import { API_URL } from '../config/api';

const ENERGY_STORAGE_KEY = 'user_energy_data';
const MAX_ENERGY = 10;
const REGEN_TIME_MS = 3 * 60 * 1000; // 3 minutes

export function useEnergy() {
  const [energy, setEnergy] = useState(2);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  // Check if Premium is currently active (unlimited energy)
  const checkPremiumActive = useCallback(async () => {
    try {
      const expStr = await AsyncStorage.getItem('user_premium_expires_at');
      if (expStr) {
        const expTime = parseInt(expStr, 10);
        if (!isNaN(expTime) && Date.now() < expTime) {
          setIsPremium(true);
          return true; // Premium active!
        }
      }
      
      const userDataStr = await AsyncStorage.getItem('user_data');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        if (userData?.premiumExpiresAt) {
          const expTime = new Date(userData.premiumExpiresAt).getTime();
          if (!isNaN(expTime) && Date.now() < expTime) {
            setIsPremium(true);
            return true;
          }
        }
      }
    } catch (e) {}
    setIsPremium(false);
    return false;
  }, []);

  const calculateEnergy = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem(ENERGY_STORAGE_KEY);
      const now = Date.now();

      if (!storedData) {
        const initialData = { energy: 2, lastUpdated: now };
        await AsyncStorage.setItem(ENERGY_STORAGE_KEY, JSON.stringify(initialData));
        setEnergy(2);
        setTimeRemaining(REGEN_TIME_MS / 1000);
      } else {
        let parsed = JSON.parse(storedData);
        let storedEnergy = typeof parsed.energy === 'number' ? parsed.energy : 2;
        let lastUpdated = parsed.lastUpdated || now;

        if (storedEnergy < MAX_ENERGY) {
          const diffMs = now - lastUpdated;
          const energyToAdd = Math.floor(diffMs / REGEN_TIME_MS);
          
          if (energyToAdd > 0) {
            storedEnergy = Math.min(MAX_ENERGY, storedEnergy + energyToAdd);
            lastUpdated = lastUpdated + (energyToAdd * REGEN_TIME_MS);
            
            if (storedEnergy === MAX_ENERGY) {
              lastUpdated = now;
            }
            
            await AsyncStorage.setItem(ENERGY_STORAGE_KEY, JSON.stringify({ energy: storedEnergy, lastUpdated }));
          }

          setEnergy(storedEnergy);
          
          if (storedEnergy < MAX_ENERGY) {
            const remainder = diffMs % REGEN_TIME_MS;
            setTimeRemaining(Math.floor((REGEN_TIME_MS - remainder) / 1000));
          } else {
            setTimeRemaining(0);
          }
        } else {
          setEnergy(storedEnergy);
          setTimeRemaining(0);
        }
      }
    } catch (e) {
      console.error('Failed to load energy data', e);
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
    const socket = io(API_URL, { transports: ['websocket'] });
    const handlePremiumRevoked = async () => {
      try {
        await AsyncStorage.removeItem('user_premium_expires_at');
      } catch (e) {}
      setIsPremium(false);
      calculateEnergy();
    };

    socket.on('premium_revoked', handlePremiumRevoked);

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        calculateEnergy();
        checkPremiumActive();
      }
    });

    return () => {
      socket.off('premium_revoked', handlePremiumRevoked);
      socket.disconnect();
      subscription.remove();
    };
  }, [calculateEnergy, checkPremiumActive]);

  // Tick the timer every second for UI
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

  // Format time remaining as mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formattedTime = formatTime(timeRemaining);

  // Expose a function to consume energy
  const consumeEnergy = async (amount) => {
    // 1. Check if user has active Premium
    const hasPremium = await checkPremiumActive();
    if (hasPremium) {
      // Unlimited energy during active Premium duration!
      return true;
    }

    // 2. Read latest energy state from AsyncStorage to avoid stale closure state
    let currentStoredEnergy = energy;
    let lastUpdated = Date.now();

    try {
      const storedData = await AsyncStorage.getItem(ENERGY_STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        currentStoredEnergy = typeof parsed.energy === 'number' ? parsed.energy : energy;
        lastUpdated = parsed.lastUpdated || Date.now();
      }
    } catch (e) {}

    if (currentStoredEnergy >= amount) {
      const newEnergy = currentStoredEnergy - amount;
      
      // If we were at MAX_ENERGY, set lastUpdated to now so countdown starts fresh
      if (currentStoredEnergy >= MAX_ENERGY) {
        lastUpdated = Date.now();
      }

      await AsyncStorage.setItem(ENERGY_STORAGE_KEY, JSON.stringify({ energy: newEnergy, lastUpdated }));
      setEnergy(newEnergy);
      await calculateEnergy();
      return true;
    }
    return false; // Not enough energy
  };
  
  // Expose a function to add energy (e.g. from gifts/videos)
  const addEnergy = async (amount) => {
    const newEnergy = Math.min(MAX_ENERGY, energy + amount);
    let lastUpdated = Date.now();
    
    if (newEnergy < MAX_ENERGY) {
      const storedData = await AsyncStorage.getItem(ENERGY_STORAGE_KEY);
      if (storedData) {
        lastUpdated = JSON.parse(storedData).lastUpdated;
      }
    }

    await AsyncStorage.setItem(ENERGY_STORAGE_KEY, JSON.stringify({ energy: newEnergy, lastUpdated }));
    calculateEnergy();
  };

  return {
    energy,
    maxEnergy: MAX_ENERGY,
    timeRemaining,
    formattedTime,
    isLoading,
    isPremium,
    consumeEnergy,
    addEnergy,
    checkPremiumActive
  };
}
