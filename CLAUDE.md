# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Root level:**
- `npm run dev` - Start both client and server concurrently
- `npm run verify:firestore` - Verify Firestore connection and setup
- `npm run migrate:strategies` - Migrate strategy data from JSON to Firestore

**Client (React + Vite):**
- `npm run dev --prefix client` - Start development server 
- `npm run build --prefix client` - Build for production (TypeScript compile + Vite build)
- `npm run lint --prefix client` - Lint TypeScript files in src/ and tests/
- `npm run lint:fix --prefix client` - Auto-fix linting issues
- `npm run test --prefix client` - Run Jest tests
- `npm run test:watch --prefix client` - Run tests in watch mode

**Server (Express + TypeScript):**
- `npm run dev --prefix server` - Start development server with ts-node-dev
- `npm run build --prefix server` - Compile TypeScript and copy data files
- `npm run start --prefix server` - Start production server
- `npm run test --prefix server` - Run Jest tests


# Code style
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')


# Workflow
- Be sure to typecheck when you’re done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance


## Architecture

This is an Oblique Strategies application with a full-stack TypeScript architecture:

**Monorepo Structure:**
- `client/` - React frontend using Vite, TypeScript, Tailwind CSS, and Heroicons
- `server/` - Express backend with TypeScript, CORS, and dotenv
- `shared/` - Shared TypeScript types used by both client and server

**Data Model:**
- Strategies are stored in `server/src/data/strategies.json` as an array of objects with `id` and `text` properties
- Shared type definition in `shared/types/strategy.ts` defines the `Strategy` interface

**Frontend Architecture:**
- React 19 with TypeScript and Vite build system
- Tailwind CSS v4 for styling with Heroicons for icons
- Fuse.js for fuzzy search functionality
- Custom hooks in `hooks/` for state management (daily strategy, favorites)
- Component structure includes strategy display, search, favorites, and daily reminder features
- Jest + Testing Library for component and hook testing

**Backend Architecture:**
- Express server with TypeScript
- Environment configuration via `.env` file and `src/env.ts`
- CORS configured for client origin
- JSON data served through REST API routes

**Key Files:**
- `shared/types/strategy.ts` - Core data type definitions
- `server/src/data/strategies.json` - Oblique Strategies data source
- Client components are in `client/src/components/` with corresponding tests in `client/tests/components/`
- Custom hooks in `client/src/hooks/` with tests in `client/tests/hooks/`

**Testing:**
- Both client and server use Jest with `--passWithNoTests` flag
- Client includes Testing Library for React component testing
- TypeScript configuration split across multiple tsconfig files for different contexts

## Firebase Authentication Testing Plan

**Completed Setup:**
- ✅ Firebase dependencies installed (firebase: ^12.0.0)
- ✅ AuthProvider integrated into App.tsx
- ✅ Login/profile UI components created
- ✅ UserProfile dropdown with logout functionality
- ✅ StrategiesContext created for Firestore data management
- ✅ Google OAuth authentication working
- ✅ GitHub OAuth authentication working
- ✅ Logout functionality working

**Current Status:**
- ✅ Firestore data migration completed (116 strategies migrated)
- ✅ Security rules published in Firebase Console
- ✅ StrategiesContext fully implemented and integrated
- ✅ Components updated: StrategyView, useDailyStrategy, FavoritesList, SearchStrategy
- ✅ All component tests migrated to StrategiesContext (25/27 tests passing)
- ✅ Favorites bug fixed - StrategyCard now uses correct toggleFavorite method
- ✅ Test framework properly configured for Vite + Firebase environment
- ✅ Jest mocks working correctly for Firebase and import.meta.env
- 🔄 2 minor test failures remaining in useDailyStrategy (timing issues)

**Progress Summary:**
- **Test Coverage:** All major components migrated from REST API to Firestore patterns
- **Passing Tests:** FavoritesList, SearchStrategy, StrategyView components
- **Failing Tests:** useDailyStrategy hook (2 async timing tests)
- **Architecture:** Full transition from REST API to Firebase/Firestore completed

**Next Session Tasks:**
1. **Complete Testing Setup:**
   - Fix remaining 2 useDailyStrategy test failures (async timing issues)
   - Add tests for favorites functionality
   
2. **UI Improvements:**
   - Add spinner icon to favorite button during async toggleFavorite operation
   - Improve loading states across the application
   
3. **Test Full Firestore Migration:**
   - Test app works without Express server running
   - Verify strategies load from Firestore
   - Test user favorites sync with Firestore
   - Test daily strategy functionality
   
4. **Clean Up (if time permits):**
   - Remove old useFavorites hook if unused
   - Update documentation
   - Consider removing server-side strategy routes

**Testing Plan:**

**High Priority Setup:**
1. Set up Firebase project and configure environment variables (IN PROGRESS)
2. ~~Install Firebase dependencies in client package.json~~ ✅
3. ~~Integrate AuthProvider into main App.tsx~~ ✅
4. ~~Add login/profile buttons to main UI to trigger authentication flow~~ ✅

**Medium Priority Testing:**
5. ~~Test Google OAuth authentication flow~~ ✅ WORKING
6. ~~Test GitHub OAuth authentication flow~~ ✅ WORKING
7. Test email/password registration and login
8. Test anonymous/guest authentication
9. Test user session persistence across page refreshes
10. ~~Test logout functionality~~ ✅ WORKING

**Low Priority Enhancement:**
11. ~~Create UserProfile component to display user info when authenticated~~ ✅

**Firebase Setup Steps:**
1. Create Firebase Project:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project → Enable Google Analytics (optional)
   - Go to Authentication → Get Started → Enable sign-in methods:
     - Google (required for Google auth)
     - GitHub (required for GitHub auth) 
     - Email/Password (required for email auth)
     - Anonymous (required for guest auth)

2. Get Firebase Config:
   - Project Settings → General → Your apps → Web app
   - Copy the config object values

3. Set Environment Variables:
   - Create `.env` file from `.env.example`
   - Replace placeholder values with your Firebase config

4. Test the Authentication:
   - Run `npm run dev` 
   - Click "Sign In" button to test each auth method
