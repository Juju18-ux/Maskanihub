# MaskaniHub

![Deploy](https://img.shields.io/badge/hosting-Firebase-orange?logo=firebase)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

**Find your home, anywhere in Kenya.**

MaskaniHub is a real estate listings platform connecting renters and buyers directly with verified landlords across Kenya — from budget housing to premium properties, covering every major town.

🔗 **Live site:** [maskani-hub.web.app](https://maskani-hub.web.app)

---

## ✨ Features

- 🏘️ **Browse listings** — Search and filter properties by location, price, and type across Kenya
- 🔐 **Authentication** — Sign in with Google or email/password via Firebase Auth
- ❤️ **Saved listings** — Bookmark properties to revisit later
- 🔔 **Alerts** — Get notified when new listings match your criteria
- 📋 **Viewing requests** — Request property viewings directly through the platform
- 🌓 **Light/dark theme** — Comfortable browsing, day or night
- 📱 **Responsive design** — Works seamlessly across desktop and mobile

---

## 🛠️ Tech Stack

| Layer          | Technology                  |
|----------------|------------------------------|
| Frontend       | React + TypeScript + Vite    |
| Styling        | Tailwind CSS                 |
| Authentication | Firebase Authentication (Google & Email) |
| Database       | Cloud Firestore              |
| Hosting        | Firebase Hosting             |
| Design source  | Figma Make                   |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- npm
- A [Firebase](https://firebase.google.com/) project

### Installation

```bash
git clone https://github.com/yourusername/maskanihub.git
cd maskanihub
npm install
```

### Environment setup

Create a `.env.local` file in the project root with your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
firebase login
firebase init hosting   # first-time setup only
npm run build
firebase deploy
```

---

## 📁 Project Structure

```
maskanihub/
├── src/
│   ├── components/     # UI components (AuthModal, MainApp, GlobeIntro, etc.)
│   ├── context/         # React context providers (Theme, etc.)
│   ├── lib/              # Firebase config & helper functions
│   └── App.tsx          # Root component
├── public/                # Static assets
├── firebase.json          # Firebase Hosting configuration
└── package.json
```

---

## 🔒 Authentication & Security

MaskaniHub uses Firebase Authentication with Google Sign-In and email/password. User-specific data (saved listings, alerts, viewing requests) is stored in Firestore under per-user subcollections, protected by security rules that restrict access to the authenticated owner only.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgements

Built with [Figma Make](https://figma.com) and deployed on [Firebase](https://firebase.google.com).
