export class VoiceCommandSystem {
  private recognition: any;
  private isListening = false;
  private commands: Map<string, () => void> = new Map();

  constructor() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'hi-IN';

      this.recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase().trim();
        this.processCommand(command);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }

  registerCommand(trigger: string, action: () => void) {
    this.commands.set(trigger.toLowerCase(), action);
  }

  private processCommand(command: string) {
    for (const [trigger, action] of this.commands) {
      if (command.includes(trigger)) {
        action();
        this.speak(`${trigger} command executed`);
        return;
      }
    }
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
      this.isListening = true;
      this.speak('Voice commands activated');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text: string, lang: string = 'hi-IN') {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }

  isSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

export const voiceCommands = new VoiceCommandSystem();
