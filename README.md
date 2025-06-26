# Twitter Clone

A modern, responsive Twitter clone built with React, Firebase, and Tailwind CSS. This application replicates the core functionality and design of Twitter (X) with real-time features and a clean, intuitive interface.

## 🚀 Features

### Core Functionality
- **Real-time Tweet Feed**: View and post tweets with live updates
- **User Authentication**: Firebase Auth with email/password and Google sign-in
- **User Profiles**: Complete profile pages with follower counts and bio
- **Tweet Interactions**: Like, retweet, and reply to tweets
- **Follow System**: Follow and unfollow other users
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark/Light Mode**: Toggle between themes with system preference detection

### Technical Features
- **Real Backend**: Firebase Firestore for data persistence
- **Real-time Updates**: Live tweet feed and interaction updates
- **Trending Topics**: Integration with GNews API for trending content
- **Modern UI**: Twitter-inspired design with smooth animations
- **Mobile-First**: Responsive layout with mobile navigation
- **Performance Optimized**: Efficient data loading and caching

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Date Handling**: Day.js
- **HTTP Client**: Axios (for external APIs)

## 📱 Screenshots & Demo

The application features a clean, modern interface that closely matches Twitter's design:

- **Home Feed**: Real-time tweet stream with compose functionality
- **Profile Pages**: User profiles with tweets, followers, and following counts
- **Explore Page**: Trending topics and search functionality
- **Mobile Navigation**: Bottom tab bar and slide-out menu
- **Dark Mode**: Complete dark theme support

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

5. **Configure Firestore Security Rules**
   
   Add these rules to your Firestore database:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own user document
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         allow read: if request.auth != null;
       }
       
       // Tweets are readable by all authenticated users
       // Only the author can write/update their tweets
       match /tweets/{tweetId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null && request.auth.uid == resource.data.userId;
         allow update: if request.auth != null;
       }
     }
   }
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application.

### Firebase Setup Details

1. **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable Email/Password and Google providers

2. **Firestore Database**:
   - Create a Firestore database in production mode
   - Set up the security rules as shown above

3. **Optional - GNews API**:
   - Get a free API key from [GNews](https://gnews.io)
   - Add it to your `.env` file for trending topics

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

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   └── MobileSidebar.jsx
│   ├── Tweet/
│   │   ├── Tweet.jsx
│   │   ├── TweetComposer.jsx
│   │   └── TweetList.jsx
│   └── ProtectedRoute.jsx
├── contexts/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── pages/
│   ├── Home.jsx
│   ├── Explore.jsx
│   ├── Profile.jsx
│   └── Auth.jsx
├── services/
│   ├── tweetService.js
│   ├── userService.js
│   └── newsService.js
├── config/
│   └── firebase.js
└── styles/
    └── index.css
```

## 🎨 Design System

The application uses a comprehensive design system inspired by Twitter:

### Colors
- **Primary**: Twitter Blue (#1DA1F2)
- **Dark Theme**: Custom dark color palette
- **Text**: Proper contrast ratios for accessibility

### Typography
- **Font**: System fonts for optimal performance
- **Hierarchy**: Clear heading and body text styles

### Components
- **Buttons**: Consistent styling with hover states
- **Forms**: Clean input fields with focus states
- **Cards**: Tweet cards with subtle shadows

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Features Implementation

1. **Real-time Updates**: Using Firestore's `onSnapshot` for live data
2. **Responsive Design**: Mobile-first approach with Tailwind breakpoints
3. **State Management**: Context API for auth and theme state
4. **Performance**: Optimized with proper React patterns and lazy loading

## 🚀 Deployment

### Building for Production
```bash
npm run build
```

### Deployment Options
- **Netlify**: Connect your GitHub repo for automatic deployments
- **Vercel**: Import project and deploy with zero configuration
- **Firebase Hosting**: Use `firebase deploy` after setting up Firebase CLI

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Twitter for the original design inspiration
- Firebase for the excellent backend services
- Tailwind CSS for the utility-first CSS framework
- Lucide React for the beautiful icons

## 📞 Support

If you have any questions or need help setting up the project:

1. Check the existing issues in the GitHub repository
2. Create a new issue with detailed information
3. Join our community discussions

---

**Note**: This is a clone built for educational purposes. It is not affiliated with Twitter/X or Meta.