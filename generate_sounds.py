import wave
import struct
import math
import os

os.makedirs('assets/sounds', exist_ok=True)

def generate_tone(filename, freq, duration_ms, volume=0.5):
    sample_rate = 44100
    num_samples = int(sample_rate * (duration_ms / 1000.0))
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1) # Mono
        wav_file.setsampwidth(2) # 2 bytes per sample
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            # Fade out at the end
            envelope = 1.0 - (i / num_samples)
            value = int(volume * envelope * 32767.0 * math.sin(2.0 * math.pi * freq * i / sample_rate))
            data = struct.pack('<h', value)
            wav_file.writeframesraw(data)

# Tick: short high-pitch pop (e.g. 1500 Hz for 20ms)
generate_tone('assets/sounds/tick.wav', 1500, 20, 0.3)

# Correct: medium-high pleasant beep (e.g. 800 Hz for 150ms)
generate_tone('assets/sounds/correct.wav', 800, 150, 0.4)

# Wrong: low buzzer (e.g. 150 Hz for 300ms)
generate_tone('assets/sounds/wrong.wav', 150, 300, 0.6)

print("Sounds generated.")
