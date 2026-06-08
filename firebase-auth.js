// ============================================================
// Firebase Authentication – Indian Cloths
// ============================================================
// SETUP (one-time):
// 1. Visit https://console.firebase.google.com and create / open your project.
// 2. Project Settings > General > Your apps > Add app (Web icon).
// 3. Copy the config values into the firebaseConfig object below.
// 4. In Firebase Console: Authentication > Sign-in method > Enable "Google".
// 5. Authentication > Settings > Authorized domains > add your Netlify domain.
// ============================================================

const firebaseConfig = {
  apiKey:            "REPLACE_WITH_YOUR_API_KEY",
  authDomain:        "REPLACE_WITH_YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket:     "REPLACE_WITH_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId:             "REPLACE_WITH_YOUR_APP_ID"
};

// Guard against double-initialisation across pages
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// ---- helpers used by auth.html / login.html / register.html ----

async function signInWithGoogle() {
  const result = await auth.signInWithPopup(googleProvider);
  return result.user;
}

async function signInWithEmail(email, password) {
  const result = await auth.signInWithEmailAndPassword(email, password);
  return result.user;
}

async function registerWithEmail(email, password, displayName) {
  const result = await auth.createUserWithEmailAndPassword(email, password);
  if (displayName) {
    await result.user.updateProfile({ displayName });
  }
  return result.user;
}

async function firebaseSignOut() {
  await auth.signOut();
  localStorage.removeItem('user_session');
}

// Build a plain-object session from a Firebase User
function buildSession(user) {
  return {
    userId:    user.uid,
    fullName:  user.displayName || user.email.split('@')[0],
    email:     user.email,
    phone:     user.phoneNumber  || '',
    photoURL:  user.photoURL     || '',
    provider:  user.providerData[0]?.providerId || 'password',
    loginAt:   new Date().toISOString()
  };
}

// Keep localStorage session in sync with Firebase auth state,
// then call the page-level hook if it was defined before this script loaded.
auth.onAuthStateChanged((user) => {
  if (user) {
    localStorage.setItem('user_session', JSON.stringify(buildSession(user)));
  } else {
    localStorage.removeItem('user_session');
  }
  if (typeof window.__onFirebaseAuthReady === 'function') {
    window.__onFirebaseAuthReady(user);
  }
});
