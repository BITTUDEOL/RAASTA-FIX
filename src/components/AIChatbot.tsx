import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, Volume2, VolumeX } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatbotAI } from '../utils/chatbot';

interface AIChatbotProps {
  isDark: boolean;
}

export default function AIChatbot({ isDark }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = chatbotAI.processMessage('Hello');
      setMessages([welcomeMessage]);
      if (autoSpeak) {
        chatbotAI.speakMessage(welcomeMessage.text);
        setIsSpeaking(true);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'hi-IN';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const botResponse = chatbotAI.processMessage(inputText);
      setMessages(prev => [...prev, botResponse]);

      if (autoSpeak) {
        chatbotAI.speakMessage(botResponse.text);
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 5000);
      }
    }, 500);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const toggleAutoSpeak = () => {
    if (autoSpeak) {
      chatbotAI.stopSpeaking();
      setIsSpeaking(false);
    }
    setAutoSpeak(!autoSpeak);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 animate-bounce"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-8 h-8" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
        </button>
      )}

      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 w-96 h-[600px] rounded-2xl shadow-2xl flex flex-col ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-lg">RaastaFix AI Assistant</h3>
                <p className="text-xs opacity-90">Ask me in English, I'll help you</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleAutoSpeak}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title={autoSpeak ? 'Turn off voice' : 'Turn on voice'}
              >
                {autoSpeak ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.isBot
                      ? isDark
                        ? 'bg-gray-700 text-white'
                        : 'bg-white text-gray-900 shadow-md'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${message.isBot ? 'opacity-60' : 'opacity-80'}`}>
                    {new Date(message.timestamp).toLocaleTimeString('hi-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isSpeaking && (
              <div className="flex justify-start">
                <div className={`px-4 py-2 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={`p-4 border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-b-2xl`}>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type in English..."
                className={`flex-1 px-4 py-3 rounded-xl border ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              <button
                onClick={handleVoiceInput}
                className={`p-3 rounded-xl transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title="Voice input"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="p-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className={`text-xs mt-2 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              💡 Tips: "How to report?", "How to use the map?", "What are voice commands?"
            </p>
          </div>
        </div>
      )}
    </>
  );
}
