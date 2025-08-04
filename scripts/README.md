# Migration Scripts

This directory contains scripts for migrating data and setting up the Firebase backend.

## migrate-strategies.js

Migrates strategy data from the JSON file to Firestore database.

### Prerequisites

1. **Firebase Project Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database
   - Get your Firebase config values

2. **Environment Variables**
   Set the same environment variables used by the client app:
   ```bash
   export VITE_FIREBASE_API_KEY="your-api-key"
   export VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   export VITE_FIREBASE_PROJECT_ID="your-project-id"
   export VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   export VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   export VITE_FIREBASE_APP_ID="your-app-id"
   ```

   Or create a `.env` file in the root directory with these values.

### Usage

```bash
# From the project root directory
node scripts/migrate-strategies.js
```

### What it does

1. **Connects to Firestore** using your Firebase config
2. **Reads strategies** from `server/src/data/strategies.json`
3. **Checks for existing data** and asks for confirmation if found
4. **Migrates all strategies** using batched writes for performance
5. **Verifies the migration** by counting documents
6. **Shows Firestore security rules** that need to be configured

### After Migration

1. **Set up Firestore Security Rules**
   - Go to Firebase Console > Firestore Database > Rules
   - Copy and paste the security rules displayed by the script

2. **Update App Components**
   - Components will need to use the `StrategiesContext` instead of REST API calls
   - Remove dependencies on the Express server for strategy data

3. **Test the Application**
   - Verify that strategies load from Firestore
   - Test user favorites and daily strategy features

### Data Structure

The script creates this Firestore structure:

```
/strategies/{strategyId}
  - id: number
  - text: string
  - createdAt: timestamp
  - updatedAt: timestamp

/users/{userId}/favorites/{strategyId}
/users/{userId}/settings/preferences
/users/{userId}/dailyStrategies/{date}
```

### Troubleshooting

**"Missing Firebase configuration"**
- Make sure all VITE_FIREBASE_* environment variables are set
- Check that the values are correct (no quotes needed in .env file)

**"Permission denied"**
- Ensure your Firebase project has Firestore enabled
- Check that your Firebase config is correct
- Make sure you have proper permissions on the Firebase project

**"Strategies JSON file not found"**
- Verify you're running the script from the project root directory
- Check that `server/src/data/strategies.json` exists