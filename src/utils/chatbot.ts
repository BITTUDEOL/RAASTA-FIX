import { ChatMessage } from '../types';

const englishResponses: { [key: string]: string[] } = {
  greeting: [
    'Hello! I am the RaastaFix assistant. How can I help you?',
    'Welcome! This is RaastaFix. How may I assist you?'
  ],
  report: [
    'To file a report: 1) Select issue type 2) Fill in details 3) Upload a photo 4) Set location 5) Submit',
    'Filing a new report is easy! Fill out the form on the left and press submit.'
  ],
  map: [
    'Pin colors on the map: Yellow = Pending, Blue = In Progress, Green = Resolved. Red badge = Rain hazard.',
    'Click on any pin on the map to view the full report details.',
    'All reports appear on the live map in real time! Colors indicate status.'
  ],
  authority: [
    'Switch to Authority Mode using the top right button. Then you can approve and resolve submitted issues.'
  ],
  status: [
    'Check your report status on the live map and recent reports list.'
  ],
  features: [
    'Main features: Issue reporting, live map, status tracking, analytics dashboard, voice assistant.'
  ],
  thanks: [
    'Thank you for using RaastaFix!' 
  ],
  help: [
    'Ask me about reporting issues, using the map, or switching roles.'
  ]
};

export class ChatbotAI {
  private conversationHistory: ChatMessage[] = [];

  processMessage(userMessage: string): ChatMessage {
    const message = userMessage.toLowerCase().trim();
    let response = '';
    let category = 'help';

    if (this.containsAny(message, ['hello', 'hi', 'hey'])) {
      category = 'greeting';
    } else if (this.containsAny(message, ['report', 'complaint', 'file'])) {
      category = 'report';
    } else if (this.containsAny(message, ['map', 'location'])) {
      category = 'map';
    } else if (this.containsAny(message, ['authority', 'approve', 'resolve'])) {
      category = 'authority';
    } else if (this.containsAny(message, ['voice', 'speak', 'microphone'])) {
      category = 'features';
    } else if (this.containsAny(message, ['status', 'check', 'track'])) {
      category = 'status';
    } else if (this.containsAny(message, ['features', 'what'])) {
      category = 'features';
    } else if (this.containsAny(message, ['thanks', 'thank you'])) {
      category = 'thanks';
    }

    const responses = englishResponses[category];
    response = responses[Math.floor(Math.random() * responses.length)];

    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      text: response,
      isBot: true,
      timestamp: new Date().toISOString()
    };

    this.conversationHistory.push(botMessage);
    return botMessage;
  }

  private containsAny(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
  }

  getHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  speakMessage(text: string): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(voice => voice.lang.startsWith('hi'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  }

  stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const chatbotAI = new ChatbotAI();
