/* global jest */
import "@testing-library/jest-native/extend-expect";

// --- expo-router mock ---
jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
  Stack: ({ children }) => children ?? null,
}));

// --- firebase/auth mock ---
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(() => ({})),
}));

// --- firebase/app mock ---
jest.mock("firebase/app", () => {
  let apps = [];

  return {
    initializeApp: jest.fn((config) => {
      const app = { name: "[DEFAULT]", options: config };
      apps = [app];
      return app;
    }),
    getApps: jest.fn(() => apps),
    getApp: jest.fn(() => apps[0]),
  };
});

// --- firebase/firestore mock ---
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
}));

// --- expo-router mocks for more complex behavior ---
jest.mock("expo-router", () => {
  const React = require("react");

  return {
    router: {
      replace: jest.fn(),
      push: jest.fn(),
      back: jest.fn(),
    },
    Stack: ({ children }) => children ?? null,

    // Runs the focus callback after mount (once), which stops the re-render loop
    useFocusEffect: (cb) => {
      React.useEffect(() => {
        const cleanup = cb();
        return typeof cleanup === "function" ? cleanup : undefined;
      }, []);
    },

    // default; override in tests when needed
    useLocalSearchParams: jest.fn(() => ({})),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});
