import "@testing-library/jest-dom";

// Mock Firebase config module that uses import.meta.env
jest.mock("./config/firebase", () => ({
  auth: {
    currentUser: null,
    signInWithPopup: jest.fn(),
    signOut: jest.fn()
  },
  db: {
    collection: jest.fn(),
    doc: jest.fn()
  },
  googleProvider: {},
  githubProvider: {}
}));

// Mock Firebase modules for testing
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn()
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({ currentUser: null })),
  GoogleAuthProvider: jest.fn(),
  GithubAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn()
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  onSnapshot: jest.fn()
}));
