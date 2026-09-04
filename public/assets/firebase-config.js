/* =========================================================
   PPM DAERAH BALING
   FIREBASE CONFIGURATION
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyAU-mdQWJkF9tiyrl6ZxJeGTyfHG2TYSVU",
  authDomain: "ppmdaerahbaling.firebaseapp.com",
  projectId: "ppmdaerahbaling",
  storageBucket: "ppmdaerahbaling.firebasestorage.app",
  messagingSenderId: "336046440771",
  appId: "1:336046440771:web:f26f1be4acc6ec265d6ff6"
};


// ================= INITIALIZE FIREBASE =================

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


// ================= FIRESTORE =================

const db = firebase.firestore();