#!/usr/bin/env node

/**
 * Oblique Strategies Data Migration Script
 * 
 * This script migrates strategy data from JSON file to Firestore.
 * 
 * Usage:
 *   node scripts/migrate-strategies.js
 * 
 * Prerequisites:
 *   1. Firebase project with Firestore enabled
 *   2. Environment variables set (same as client app)
 *   3. Appropriate Firebase permissions
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, writeBatch, orderBy, query } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

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

// Validate config
if (!firebaseConfig.projectId) {
  console.error('❌ Missing Firebase configuration in client/.env');
  console.log('Make sure client/.env contains:');
  console.log('  VITE_FIREBASE_PROJECT_ID');
  console.log('  VITE_FIREBASE_API_KEY');
  console.log('  VITE_FIREBASE_AUTH_DOMAIN');
  console.log('  VITE_FIREBASE_STORAGE_BUCKET');
  console.log('  VITE_FIREBASE_MESSAGING_SENDER_ID');
  console.log('  VITE_FIREBASE_APP_ID');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log(`🔥 Connected to Firebase project: ${firebaseConfig.projectId}`);

async function askUserConfirmation(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(`${message} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function migrateStrategies() {
  try {
    console.log('🚀 Starting strategy migration to Firestore...');
    
    // Load strategies from JSON
    const strategiesPath = path.join(__dirname, '../server/src/data/strategies.json');
    
    if (!fs.existsSync(strategiesPath)) {
      console.error('❌ Strategies JSON file not found at:', strategiesPath);
      process.exit(1);
    }
    
    const strategiesData = fs.readFileSync(strategiesPath, 'utf8');
    const strategies = JSON.parse(strategiesData);
    
    console.log(`📝 Found ${strategies.length} strategies to migrate`);
    
    // Check if strategies already exist
    const strategiesRef = collection(db, 'strategies');
    const snapshot = await getDocs(strategiesRef);
    
    if (!snapshot.empty) {
      console.log(`⚠️  Strategies collection already exists with ${snapshot.size} documents`);
      const shouldOverwrite = await askUserConfirmation('Do you want to overwrite existing strategies?');
      
      if (!shouldOverwrite) {
        console.log('❌ Migration cancelled by user');
        process.exit(0);
      }
    }
    
    // Use batched writes for better performance and atomicity
    console.log('📦 Using batched writes for optimal performance...');
    
    const batchSize = 500; // Firestore batch limit
    let totalProcessed = 0;
    
    for (let i = 0; i < strategies.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchStrategies = strategies.slice(i, i + batchSize);
      
      batchStrategies.forEach((strategy) => {
        const docRef = doc(db, 'strategies', strategy.id.toString());
        batch.set(docRef, {
          id: strategy.id,
          text: strategy.text,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
      
      await batch.commit();
      totalProcessed += batchStrategies.length;
      
      console.log(`✅ Processed ${totalProcessed}/${strategies.length} strategies`);
    }
    
    // Verify migration
    console.log('🔍 Verifying migration...');
    const verifySnapshot = await getDocs(query(strategiesRef, orderBy('id')));
    
    if (verifySnapshot.size === strategies.length) {
      console.log('\n🎉 Migration completed successfully!');
      console.log(`✅ All ${strategies.length} strategies migrated`);
      
      // Show sample data
      console.log('\n📋 Sample migrated strategies:');
      verifySnapshot.docs.slice(0, 3).forEach((doc) => {
        const data = doc.data();
        console.log(`  ${data.id}: "${data.text}"`);
      });
      
      console.log('\n📋 Next steps:');
      console.log('1. ✅ Data migration complete');
      console.log('2. 🔒 Set up Firestore security rules');
      console.log('3. 🔄 Update app components to use StrategiesContext');
      console.log('4. 🧪 Test the application');
      
    } else {
      console.error(`❌ Migration verification failed!`);
      console.error(`Expected ${strategies.length} documents, found ${verifySnapshot.size}`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

function printSecurityRules() {
  console.log('\n🔒 Required Firestore Security Rules:');
  console.log('Copy and paste these rules into Firebase Console > Firestore Database > Rules:');
  console.log('─'.repeat(60));
  console.log(`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Strategies collection - read-only for all authenticated users
    match /strategies/{strategyId} {
      allow read: if true; // Public read access
      allow write: if false; // No client writes - admin only
    }
    
    // User-specific data - only the authenticated user can access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // User favorites
      match /favorites/{favoriteId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // User settings  
      match /settings/{settingId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Daily strategies tracking
      match /dailyStrategies/{dailyId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}`);
  console.log('─'.repeat(60));
}

// Main execution
async function main() {
  try {
    await migrateStrategies();
    printSecurityRules();
    
    console.log('\n🎉 Setup completed successfully!');
    console.log('You can now update your app components to use Firestore data.');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

main();