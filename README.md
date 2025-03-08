# 🎣 FishTracker

FishTracker is a modern web application for anglers to track their fishing adventures, record catches, and analyze their progress over time.

## ✨ Features

- 📱 Responsive design that works on desktop and mobile
- 🗺️ Interactive maps to record and view catch locations
- 🌤️ Real-time weather integration
- 📊 Detailed catch statistics and analytics
- 🌙 Moon phase tracking for optimal fishing times
- 🔒 Privacy controls for catch visibility
- 🌐 Internationalization support (English and Portuguese)
- 🌓 Dark mode support

## 🚀 Tech Stack

- React 18
- TypeScript
- Vite
- Firebase (Authentication, Firestore, Storage)
- Tailwind CSS
- React Router
- Zustand (State Management)
- i18next (Internationalization)
- Leaflet (Maps)
- Lucide Icons

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fishtracker.git
cd fishtracker
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:

```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/        # Reusable UI components
├── hooks/            # Custom React hooks
├── i18n/             # Internationalization files
│   └── locales/      # Translation files
├── lib/              # Firebase and utility functions
├── pages/            # Application pages/routes
├── store/            # Zustand state management
├── types/            # TypeScript type definitions
└── main.tsx          # Application entry point
```

## 🔐 Authentication

The application supports:

- Email/Password authentication
- Google Sign-In
- Password reset functionality

## 📱 Features in Detail

### Dashboard

- Overview of fishing statistics
- Recent catches display
- Interactive map of catch locations
- Monthly activity chart

### Catch Management

- Add new catches with photos
- Record catch details (species, weight, length)
- Automatic weather data recording
- Location mapping
- Privacy controls

### Profile

- Customizable user profiles
- Profile photo management
- Favorite species selection
- Location settings

### Settings

- Notification preferences
- Privacy controls
- Unit preferences (metric/imperial)
- Date and time format settings

## 🌐 Internationalization

The application supports multiple languages:

- English (default)
- Portuguese

To add a new language:

1. Create a new translation file in `src/i18n/locales/`
2. Add the language to the i18n configuration
3. Update the language switcher component

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Leaflet](https://leafletjs.com/)
- [Open-Meteo](https://open-meteo.com/) for weather data
