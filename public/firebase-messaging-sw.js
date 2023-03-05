importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging.js"
);
importScripts("./env-vars.js");

var config = {
  apiKey: VUE_APP_FIREBASE_API_KEY,
  authDomain: VUE_APP_FIREBASE_PROJECT_ID + ".firebaseapp.com",
  databaseURL: "https://" + VUE_APP_FIREBASE_PROJECT_ID + ".firebaseio.com",
  projectId: VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: VUE_APP_FIREBASE_PROJECT_ID + ".appspot.com",
  messagingSenderId: VUE_APP_FIREBASE_SENDER_ID,
  appId: VUE_APP_FIREBASE_APP_ID,
  measurementId: VUE_APP_FIREBASE_MEASUREMENT_ID
};

firebase.initializeApp(config);

const messaging = firebase.messaging.isSupported()
  ? firebase.messaging()
  : null;
