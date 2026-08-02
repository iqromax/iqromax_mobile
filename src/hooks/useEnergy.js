import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ENERGY_STORAGE_KEY = 'user_energy_data';
const MAX_ENERGY = 10;
const REGEN_TIME_MS = 3 * 60 * 1000; // 3 minutes

export function useEnergy() {
  const [energy, setEnergy] = useState(2);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [isLoading, setIsLoading] = useState(true);

  const calculateEnergy = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem(ENERGY_STORAGE_KEY);
      const now = Date.now();

      if (!storedData) {
        // First time initialization
        const initialData = { energy: 2, lastUpdated: now };
        await AsyncStorage.setItem(ENERGY_STORAGE_KEY, JSON.stringify(initialData));
        setEnergy(2);
        setTimeRemaining(0); // No timer needed if they just started (wait, actually they need a timer to get to 10!)
        // Wait, if energy is 2, it should start regenerating to 10.
        // So time remaining is 3 minutes.
        setTimeRemaining(REGEN_TIME_MS / 1000);
      } else {
        let { energy: storedEnergy, lastUpdated } = JSON.parse(storedData);

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
          setEnergy(MAX_ENERGY);
          setTimeRemaining(0);
        }
      }
    } catch (e) {
      console.error('Failed to load energy data', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Recalculate on mount and app state change (foreground/background)
  useEffect(() => {
    calculateEnergy();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        calculateEnergy();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [calculateEnergy]);

  // Tick the timer every second for UI
  useEffect(() => {
    if (energy >= MAX_ENERGY || isLoading) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up! Recalculate to add energy and reset timer
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
    if (energy >= amount) {
      const newEnergy = energy - amount;
      let lastUpdated = Date.now();
      
      // If we were at max, the regeneration starts now. 
      // If we were already regenerating, we don't reset lastUpdated so the timer continues.
      if (energy < MAX_ENERGY) {
        const storedData = await AsyncStorage.getItem(ENERGY_STORAGE_KEY);
        if (storedData) {
          lastUpdated = JSON.parse(storedData).lastUpdated;
        }
      }

      await AsyncStorage.setItem(ENERGY_STORAGE_KEY, JSON.stringify({ energy: newEnergy, lastUpdated }));
      calculateEnergy();
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
    consumeEnergy,
    addEnergy,
  };
}
