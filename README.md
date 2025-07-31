# Business Evertwine

A Next.js application with Firebase authentication and storage capabilities, built with shadcn/ui components.

## Features

- 🔐 **Multiple Authentication Methods**:
  - Email/Password signup and signin
  - Google OAuth integration
  - Phone number verification with SMS
- 📁 Firebase Storage for file uploads
- 🎨 Modern UI with shadcn/ui components
- 📱 Responsive design with Tailwind CSS
- 🔒 Protected routes and user management
- 🧪 Test login functionality
- 🌍 International phone number support

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- A Firebase project

### Installation

1. Clone the repository or navigate to the project directory:

   ```bash
   cd business_evertwine
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up Firebase:

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Authentication with Email/Password provider
   - Enable Cloud Storage
   - Get your Firebase configuration

4. Configure environment variables:

   - Copy the Firebase configuration values
   - Update `.env.local` with your Firebase project details:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Authentication

- **Email/Password**: Traditional signup and signin
- **Google Sign-In**: One-click authentication with Google account
- **Phone Verification**: SMS-based authentication with international support
- **Test Login**: Use the "Test Login" button (requires creating a test account first)

### File Storage

- Upload files to Firebase Storage
- View uploaded files
- Files are stored in user-specific folders

### Test Account Setup

To use the test login feature:

1. First create an account with:
   - Email: `test@example.com`
   - Password: `password123`
2. Then you can use the "Test Login" button

## Firebase Setup Details

### Authentication Rules

Make sure to enable Email/Password authentication in your Firebase project:

1. Go to Authentication > Sign-in method
2. Enable Email/Password provider

### Storage Rules

Update your Firebase Storage rules for user-specific access:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
