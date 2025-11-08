# 🛣️ RaastaFix - AI-Powered Smart Civic Reporting Platform

RaastaFix is a next-generation civic engagement platform that empowers citizens to report infrastructure issues and track their resolution in real-time. Built with cutting-edge AI technology, voice assistance, and professional-grade features.

---

## ✨ Key Features

### 🤖 AI-Powered Features
- Full AI assistant chatbot
- Voice Commands: Hands-free operation with voice recognition
- Smart Weather Integration: Automatic hazard detection during rainy conditions
- Intelligent Priority System: AI-based priority assignment for reports

### 📊 Advanced Analytics
- Real-time Dashboard: Comprehensive analytics with charts and trends
- Export Functionality: Download reports as CSV for analysis
- Performance Metrics: Track resolution times and efficiency
- Trend Analysis: 7-day report trends visualization

### 🗺️ Interactive Mapping
- Live Map: Real-time issue tracking with color-coded pins
  - 🟡 Yellow = Pending
  - 🔵 Blue = In Progress
  - 🟢 Green = Resolved
  - 🚨 Red Badge = Rain Hazard
- Click-to-View: Detailed report information on pin click
- Geolocation Support: Automatic location detection

### 👥 User Roles
- Citizen Mode: Report issues, track status, view analytics
- Authority Mode: Resolve issues, manage reports, update status
- Admin Features: Advanced filtering and search

### 🔔 Engagement Features
- Notification System: Real-time alerts for report updates
- Report Tracking: View count, upvotes, comments (ready for implementation)
- My Reports: Filter to see only your submissions
- Status Updates: Real-time status tracking

### 🎨 Modern UI/UX
- Dark/Light Theme: Beautiful themes with smooth transitions
- Fully Responsive: Perfect on mobile, tablet, and desktop
- English Interface
- Professional Design: Orange-red gradient theme
- Smooth Animations: Polished micro-interactions

### 🔍 Search & Filter
- Advanced Search: Search by title, description, or location
- Type Filters: Filter by issue type (Pothole, Streetlight, Water Leak, etc.)
- My Reports Filter: See only your submissions
- Real-time Filtering: Instant results

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Modern web browser with microphone access (for voice features)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd raastafix
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
4. Build for production:
```bash
npm run build
```

---

## 📱 How to Use

### For Citizens

1. Sign In
   - Click "Sign In" button
   - Enter your name, email, and phone
   - Start reporting!

2. Report an Issue
   - Select issue type: Pothole, Streetlight, Water Leak, Waste, Manhole
   - Add title and detailed description
   - Upload a photo (required)
   - Click "Get Location" to capture your position
   - Submit the report

3. Track Status
   - View your reports in "My Reports" filter
   - Check the live map for real-time status
   - Get notifications on updates

4. Use Voice Assistant
   - Click the orange chatbot button (bottom right)
   - Ask questions in English like:
     - "How do I file a report?"
     - "How do I view the map?"
     - "What are voice commands?"
   - Enable voice output for spoken responses

5. Use Voice Commands
   - Click the blue microphone button
   - Say commands like:
     - "Open report"
     - "Show map"
     - "My reports"
     - "Change theme"

### For Authorities

1. Switch to Authority Mode
   - Click the "Citizen Mode" button in header
   - Switches to "Authority Mode"
   - Red banner appears at top

2. Resolve Issues
   - Click on any yellow or blue pin on the map
   - Review the report details
   - Click "Mark as Resolved" button
   - Pin turns green instantly

3. View Analytics
   - Click the chart icon in header
   - View comprehensive dashboard
   - Export data as CSV
   - Track performance metrics

---

## 🎯 Features Breakdown

### Issue Types
1. 🕳️ Pothole / Road Damage
2. 💡 Broken Streetlight
3. 💧 Water Leakage
4. 🗑️ Illegal Waste Dumping
5. ⚠️ Open Manhole / Safety Hazard

### Priority Levels
- 🔴 Critical: Rain hazards (automatic)
- 🟠 High: Safety issues like manholes
- 🟡 Medium: Standard issues
- 🟢 Low: Non-urgent matters

### Status Workflow
1. Pending: Just reported, awaiting review
2. In Progress: Authority is working on it
3. Resolved: Issue fixed and closed

---

## 🛠️ Technology Stack

### Frontend
- React 18: Modern UI library
- TypeScript: Type-safe development
- Tailwind CSS: Utility-first styling
- Leaflet: Interactive maps
- Lucide React: Beautiful icons

### Browser APIs
- Web Speech API: Voice recognition
- Speech Synthesis API: Text-to-speech
- Geolocation API: Location detection
- LocalStorage: Data persistence

### External APIs
- OpenStreetMap: Free map tiles and geocoding
- Nominatim: Reverse geocoding
- OpenWeatherMap: Weather data (optional)

---

## 🌟 Advanced Features

### AI Chatbot System
- Natural language processing
- Context-aware responses
- Voice output with emotion
- Conversation history

### Voice Command System
- Continuous listening mode
- Command recognition
- Error handling
- Visual feedback

### Analytics Engine
- Real-time calculations
- Trend analysis
- Performance metrics
- Export functionality
- Visual charts

### Data Management
- Local storage with migration
- Data backup
- Import/export
- User reputation system
- Notification queue

---

## 🔒 Privacy & Security

- All data stored locally in browser
- No server-side data collection
- Secure user authentication
- Privacy-first design
- GDPR compliant

---

## 🌐 Browser Support

- Chrome/Edge (Recommended for voice features)
- Firefox
- Safari (Limited voice support)
- Mobile browsers (iOS/Android)

---

## 📈 Future Enhancements (Roadmap)

- [ ] Real-time collaboration
- [ ] Push notifications
- [ ] SMS/Email alerts
- [ ] Government API integration
- [ ] Multi-city support
- [ ] Gamification system
- [ ] Social sharing
- [ ] Report voting system
- [ ] Comment threads
- [ ] Photo comparison (before/after)

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

---

## 📄 License

MIT License - Feel free to use this project for your city/community.

---

## 👏 Credits

Developed with ❤️ for better civic engagement

**Icons**: Lucide React
**Maps**: OpenStreetMap & Leaflet
**Design**: Custom gradient theme (Orange to Red)

---

## 📞 Support

For issues or questions:
- Open a GitHub issue
- Contact: support@raastafix.example

---

## 🎉 Thank You!

Thank you for using RaastaFix to make your city better!

**RaastaFix** - Because every street matters! 🛣️✨ 
"# RAASTA-FIX" 
