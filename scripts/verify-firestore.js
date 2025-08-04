#!/usr/bin/env node

/**
 * Firestore Setup Verification Script
 * 
 * This script verifies that Firestore is properly configured and accessible.
 * Run this before attempting data migration.
 * 
 * Usage: node scripts/verify-firestore.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, connectFirestoreEmulator } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from client/.env file
function loadClientEnv() {
  const envPath = path.join(__dirname, '../client/.env');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ Client .env file not found at:', envPath);
    console.log('Make sure client/.env exists with Firebase configuration');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && key.startsWith('VITE_FIREBASE_')) {
      envVars[key.trim()] = value.trim();
    }
  });
  
  return envVars;
}

const env = loadClientEnv();

// Firebase config - using client's environment variables
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

function validateConfig() {
  console.log('🔍 Validating Firebase configuration from client/.env...');
  
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN', 
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missing = requiredVars.filter(varName => !env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required variables in client/.env:');
    missing.forEach(varName => console.error(`  ${varName}`));
    console.log('\n💡 Make sure client/.env contains all Firebase config variables');
    return false;
  }
  
  console.log('✅ All required Firebase config variables found in client/.env');
  console.log(`📋 Project ID: ${firebaseConfig.projectId}`);
  return true;
}

async function testFirestoreConnection() {
  console.log('\n🔥 Testing Firestore connection...');
  
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firestore client initialized successfully');
    
    // Test basic read access
    console.log('🔍 Testing read access to Firestore...');
    const testCollection = collection(db, 'strategies');
    const snapshot = await getDocs(testCollection);
    
    console.log(`✅ Successfully connected to Firestore`);
    console.log(`📊 Found ${snapshot.size} documents in 'strategies' collection`);
    
    if (snapshot.empty) {
      console.log('📝 Strategies collection is empty - ready for migration');
    } else {
      console.log('📋 Sample strategies:');
      snapshot.docs.slice(0, 3).forEach(doc => {
        const data = doc.data();
        console.log(`  ${data.id}: "${data.text?.substring(0, 50)}..."`);
      });
    }
    
    return { success: true, documentCount: snapshot.size };
    
  } catch (error) {
    console.error('❌ Firestore connection failed:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('💡 This might be due to security rules. For development, you can temporarily use:');
      console.log('   allow read, write: if true;');
    }
    
    return { success: false, error: error.message };
  }
}

function printSetupInstructions() {
  console.log('\n📋 Firestore Setup Instructions:');
  console.log('─'.repeat(50));
  
  console.log('\n1. 🔥 Firebase Console Setup:');
  console.log('   → Go to https://console.firebase.google.com');
  console.log('   → Select your project or create a new one');
  console.log('   → Navigate to "Firestore Database"');
  console.log('   → Click "Create database"');
  console.log('   → Choose "Start in test mode" (for development)');
  console.log('   → Select a location (recommend same as your users)');
  
  console.log('\n2. 🔒 Security Rules (for production):');
  console.log('   → Go to Firestore Database > Rules');
  console.log('   → Replace with the rules from migrate-strategies.js');
  
  console.log('\n3. 🔑 Environment Variables:');
  console.log('   → Go to Project Settings > General > Your apps');
  console.log('   → Copy the Firebase config values');
  console.log('   → Set them as VITE_FIREBASE_* environment variables');
  
  console.log('\n4. 📦 Run Migration:');
  console.log('   → node scripts/migrate-strategies.js');
}

async function main() {
  console.log('🔍 Firestore Setup Verification\n');
  
  // Step 1: Validate configuration
  if (!validateConfig()) {
    printSetupInstructions();
    process.exit(1);
  }
  
  // Step 2: Test connection
  const result = await testFirestoreConnection();
  
  if (result.success) {
    console.log('\n🎉 Firestore verification successful!');
    
    if (result.documentCount === 0) {
      console.log('\n📋 Next steps:');
      console.log('1. Run: node scripts/migrate-strategies.js');
      console.log('2. Set up security rules in Firebase Console');
      console.log('3. Update app components to use StrategiesContext');
    } else {
      console.log('\n📋 Firestore is ready! Your app can now use StrategiesContext');
    }
    
  } else {
    console.log('\n❌ Firestore verification failed');
    printSetupInstructions();
    process.exit(1);
  }
}

main();