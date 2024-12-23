# Advanced Bookmark Management System

Modern bookmark management system with AI-powered content analysis, offline support, and automatic backups.

## Features
- AI-powered content analysis and smart tagging
- Offline support with automatic sync
- Real-time bookmark synchronization
- Google Authentication
- Tag-based organization
- Collections for better organization
- Advanced search functionality
- Automatic backups
- Dark mode support
- PWA ready

## Tech Stack
- React 18 + TypeScript
- Firebase (Auth & Firestore)
- Redux Toolkit
- OpenAI API for content analysis
- Tailwind CSS
- GitHub Actions for automated backups

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/Jedimind369/Advanced-Bookmark-Management-System-with-React-and-TypeScript.git
cd Advanced-Bookmark-Management-System-with-React-and-TypeScript
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file with the following:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_OPENAI_API_KEY=your_openai_api_key
```

4. Configure Firebase:
- Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
- Enable Google Authentication
- Create a Firestore database
- Set up security rules for Firestore

5. Start development server:
```bash
npm run dev
```

## AI Features
- Automatic content analysis
- Smart tag suggestions
- Credibility scoring
- Reading time estimation
- Key insights extraction

## Offline Support
- Full functionality when offline
- Automatic sync when back online
- Local storage for offline data
- Background sync for pending changes

## Backup System
- Automated daily backups
- GitHub Actions workflow
- Backup status monitoring
- Error notifications
- Database exports included in backups

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.