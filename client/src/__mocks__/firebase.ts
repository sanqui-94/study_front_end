// Mock Firebase configuration for tests
export const auth = {
  currentUser: null,
  signInWithPopup: jest.fn(),
  signOut: jest.fn()
};

export const db = {
  collection: jest.fn(),
  doc: jest.fn()
};

export const googleProvider = {};
export const githubProvider = {};