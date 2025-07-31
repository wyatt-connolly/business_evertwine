# Firebase Setup Instructions

This document provides step-by-step instructions for setting up Firebase for the Business Evertwine application.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `business-evertwine` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Configure Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click on **Get started** if it's your first time
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle the first switch to "Enable"
   - Click "Save"

## 3. Configure Storage

1. Go to **Storage** in the left sidebar
2. Click **Get started**
3. Choose **Start in test mode** for now (we'll update rules later)
4. Select a location for your storage bucket (choose closest to your users)
5. Click **Done**

## 4. Update Storage Rules

1. In Storage, go to the **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to upload/download files in their own folders
    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

## 5. Get Firebase Configuration

1. Go to **Project settings** (gear icon in sidebar)
2. Scroll down to "Your apps" section
3. Click **Add app** and select **Web** (</> icon)
4. Register your app with nickname: `business-evertwine-web`
5. Copy the Firebase configuration object

## 6. Update Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_from_config
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 7. Test the Application

1. Restart your development server:

   ```bash
   npm run dev
   ```

2. Go to [http://localhost:3000](http://localhost:3000)

3. Test the following features:
   - **Sign Up**: Create a new account
   - **Sign In**: Login with your credentials
   - **File Upload**: Upload files to test storage
   - **Test Login**: First create account with `test@example.com` / `password123`, then use the test login button

## 8. Production Considerations

### Authentication

- Consider enabling additional sign-in providers (Google, GitHub, etc.)
- Set up email verification for production
- Configure password reset functionality

### Storage

- Update storage rules for production use
- Set up proper CORS configuration
- Consider file size limits and quotas

### Security

- Review and tighten Firebase security rules
- Enable App Check for additional security
- Monitor usage and set up alerts

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/invalid-api-key)"**

   - Check that your API key is correct in `.env.local`
   - Ensure the environment file is properly named (`.env.local`, not `.env`)

2. **Storage uploads failing**

   - Verify storage rules are correctly configured
   - Check that authentication is working first
   - Ensure user is properly authenticated before upload

3. **Environment variables not loading**
   - Restart the development server after changing `.env.local`
   - Check that variables start with `NEXT_PUBLIC_`
   - Verify the file is in the project root directory

### Getting Help

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Firebase Console](https://console.firebase.google.com/)

## Next Steps

After setting up Firebase, you can:

1. Customize the UI components and styling
2. Add more authentication providers
3. Implement file management features
4. Add user profiles and additional data
5. Set up email verification
6. Deploy to production
