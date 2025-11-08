import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { voiceCommands } from '../utils/voiceCommands';

interface VoiceControlProps {
  isDark: boolean;
  onCommand: (command: string) => void;
}

export default function VoiceControl({ isDark, onCommand }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(voiceCommands.isSupported());
  const [lastCommand, setLastCommand] = useState('');

  useEffect(() => {
    voiceCommands.registerCommand('Open report', () => {
      onCommand('open-report');
      setLastCommand('Report form opened');
    });

    voiceCommands.registerCommand('Show map', () => {
      onCommand('show-map');
      setLastCommand('Map opened');
    });

    voiceCommands.registerCommand('My reports', () => {
      onCommand('my-reports');
      setLastCommand('Your reports');
    });

    voiceCommands.registerCommand('Help', () => {
      onCommand('help');
      setLastCommand('Help opened');
    });

    voiceCommands.registerCommand('Change theme', () => {
      onCommand('toggle-theme');
      setLastCommand('Theme changed');
    });
  }, [onCommand]);

  const toggleVoiceControl = () => {
    if (isListening) {
      voiceCommands.stopListening();
      setIsListening(false);
    } else {
      voiceCommands.startListening();
      setIsListening(true);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <button
        onClick={toggleVoiceControl}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : isDark
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
        title={isListening ? 'Stop voice commands' : 'Start voice commands'}
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>

      {isListening && (
        <div className={`absolute bottom-16 right-0 mb-2 p-3 rounded-lg shadow-lg whitespace-nowrap ${
          isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <p className="text-xs font-semibold mb-1">🎤 Listening...</p>
          <p className="text-xs opacity-75">Say: "Open report", "Show map"</p>
        </div>
      )}

      {lastCommand && !isListening && (
        <div className={`absolute bottom-16 right-0 mb-2 p-3 rounded-lg shadow-lg whitespace-nowrap ${
          isDark ? 'bg-green-800 text-white' : 'bg-green-100 text-green-900'
        }`}>
          <p className="text-xs">✓ {lastCommand}</p>
        </div>
      )}
    </div>
  );
}
