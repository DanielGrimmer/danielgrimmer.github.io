// Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyAAQiWEDlhUsBqhW0B_XcWd7UnBFEMNtjE",
    authDomain: "soccerhockeyduality.firebaseapp.com",
    projectId: "soccerhockeyduality",
    storageBucket: "soccerhockeyduality.firebasestorage.app",
    messagingSenderId: "1009260561430",
    appId: "1:1009260561430:web:803603d6a0049882602137",
    measurementId: "G-RZZGN6YM5M"
};

/**
 * The reCAPTCHA v3 **site** key, for App Check.
 *
 * Public by design, exactly like the API key above: it identifies the site to
 * reCAPTCHA and grants nothing. Its partner, the reCAPTCHA **secret** key, is a
 * real secret — it is pasted once into the Firebase console when the app is
 * registered, Firebase keeps it server-side to verify tokens, and it must never
 * appear in this repository or in any page source.
 *
 * Leave this empty and App Check is simply not started: the games behave
 * exactly as they did before, and nothing in the console needs to be true. Fill
 * it in and every request carries an attestation token, which the console can
 * then be told to require.
 */
export const appCheckSiteKey = '';
