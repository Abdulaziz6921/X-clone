# Twitter Clone 🐦

A modern, full-featured Twitter (X) clone built with React, Firebase, and Supabase. This application replicates Twitter’s core features including tweets, replies, user profiles, media uploads, real-time updates, and dark mode — with a polished UI and smooth experience.

---

## 🚀 Features

### ✅ Core Functionality

- **Tweeting**: Create tweets with text, images, and location
- **Real-time Feed**: Live updates using Firestore `onSnapshot`
- **Replies**: Support for threaded replies with modal interface
- **Like System**: Toggle likes with live count updates
- **User Profiles**: Bio, location, website, and follower counts
- **Follow/Unfollow**: Full follow system with counts
- **Media Support**: Images and videos attached to tweets
- **Explore Page**: Trending topics from GNews API
- **Dark/Light Mode**: System-aware theme switching
- **Responsive**: Optimized for mobile, tablet, and desktop

### 🧠 Advanced UX Enhancements

- **Reply Modal**: Mimics Twitter’s reply modal with parent context
- **Threaded Replies**: Grouped by parent tweet (like Twitter)
- **Emoji Picker**: Toggleable emoji picker with click-away backdrop
- **Supabase Media Uploads**: Avatars stored in Supabase buckets
- **Geolocation Tweets**: Capture and show user location in tweets
- **Avatar Preview**: Upload & preview avatar in settings
- **Cached User Profiles**: Prevents repeated user lookups

---

## 🛠️ Tech Stack

| Category      | Technology                          |
| ------------- | ----------------------------------- |
| Frontend      | React 18 + Vite                     |
| Styling       | Tailwind CSS + Dark Mode            |
| Routing       | React Router DOM                    |
| Auth          | Firebase Authentication             |
| Database      | Firebase Firestore (Tweets + Users) |
| Media Storage | Supabase Storage (Avatars/Images)   |
| Icons         | Lucide React                        |
| Dates         | Day.js                              |
| External API  | GNews API (for trending)            |
| Emoji Picker  | `@emoji-mart/react`                 |

---

## 📸 Key Screens & Components

| Feature           | Description                                     |
| ----------------- | ----------------------------------------------- |
| 🏠 Home           | Real-time feed, tweet composer, likes           |
| 🧑 Profile        | User info, tabs (tweets, replies, media, likes) |
| 💬 Reply Modal    | Replies with context (parent + threading)       |
| 📍 Tweet Location | Shows user's geolocation if granted             |
| 😄 Emoji Picker   | Opens emoji picker with click-away close        |
| ⚙️ Settings       | Update display name, bio, avatar, etc.          |

---

## 🧪 Latest Implemented Features

- ✅ **Threaded Replies** grouped by parent
- ✅ **Reusable `ReplyThread`** for both Replies tab and modal
- ✅ **Reply modal design** replicates Twitter (arrow, replying to)
- ✅ **Avatar upload** via Supabase bucket `avatars`
- ✅ **User caching** with `UserCacheContext` + `useUserCache` hook
- ✅ **Tweet geolocation** using browser `navigator.geolocation`
- ✅ **Emoji picker** that:
  - Is mobile-friendly
  - Opens in correct position
  - Has backdrop to prevent accidental tweet opening
  - Closes on outside click
- ✅ **Vertical line UI** in reply thread (for first reply only)
- ✅ **Bottom sheet-like reply modal on mobile**

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- GNews API key (optional, for trending topics)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd twitter-clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password and Google providers)
   - Create a Firestore database
   - Copy your Firebase config

4. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your Firebase configuration and optional GNews API key:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Optional - for trending topics
   VITE_GNEWS_API_KEY=your_gnews_api_key
   ```

5. **Supabase Storage Setup (Avatars)**

6. Create a Supabase project at [supabase.com](https://supabase.com)
7. Create a bucket called `avatars`
8. Enable **public access** (or use signed URLs if you prefer)
9. Copy your `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `.env`

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

6. **Start the development server**
   ```bash
   npm run dev
   ```

---

## 📖 Usage

### Creating an Account

1. Click "Sign up" on the auth page
2. Fill in your display name, email, and password
3. Or use "Continue with Google" for quick sign-up

### Using the App

1. **Post Tweets**: Use the composer at the top of the home feed
2. **Interact**: Like, retweet, and reply to tweets
3. **Follow Users**: Visit profiles and click follow
4. **Explore**: Check trending topics in the Explore section
5. **Dark Mode**: Toggle theme in the sidebar

---

## 📂 Project Structure

```
src/
├── components/
│ ├── Tweet/
│ │ ├── Tweet.jsx
│ │ ├── TweetComposer.jsx
│ │ ├── TweetList.jsx
│ │ ├── ReplyModal.jsx
│ │ ├── ReplyThread.jsx ← NEW
│ └── Layout/
│ ├── Sidebar.jsx
│ ├── MobileSidebar.jsx
│ └── Shared/
│ └── EmojiPicker.jsx ← NEW
├── contexts/
│ ├── AuthContext.jsx
│ ├── ThemeContext.jsx
│ └── UserCacheContext.jsx ← NEW
├── hooks/
│ └── useTweetHeight.js ← Optional
├── pages/
│ ├── Home.jsx
│ ├── Profile.jsx
│ ├── Explore.jsx
│ ├── Settings.jsx
│ └── Auth.jsx
├── services/
│ ├── tweetService.js
│ ├── userService.js
│ └── supabaseService.js ← NEW
├── config/
│ ├── firebase.js
│ └── supabase.js
└── styles/
└── index.css
```

---

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## 🙏 Acknowledgments

- Twitter for the original design inspiration
- Firebase for the excellent backend services
- Tailwind CSS for the utility-first CSS framework
- Lucide React for the beautiful icons

---

**Note**: This is a clone built for educational purposes. It is not affiliated with Twitter/X or Meta.
