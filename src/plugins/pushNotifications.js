import Vue from "vue";
import { initializeApp } from "firebase/app";
import { getMessaging, isSupported, getToken } from "firebase/messaging";
import { ADD_NOTIFICATION_TOKEN } from "../constants/graphQLqueries/graphQLqueries";
import { apolloClient } from "../plugins/apollo";

let instance;

export const getInstance = () => instance;

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_PROJECT_ID + ".firebaseapp.com",
  databaseURL:
    "https://" +
    process.env.VUE_APP_FIREBASE_PROJECT_ID +
    ".firebaseio.com",
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_PROJECT_ID + ".appspot.com",
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  messagingSenderId: process.env.VUE_APP_FIREBASE_SENDER_ID
};

export const usePushNotifications = () => {
  if (instance) return instance;

  instance = new Vue({
    methods: {
      saveNotificationToken(token) {
        const registerNotifTokenURL = "/register-notif-token/";
        const payload = {
          registration_id: token,
          type: "web"
        };

        apolloClient
          .mutate({
            mutation: ADD_NOTIFICATION_TOKEN,
            variables: {
              notificationToken: {
                token: token
              }
            }
          })
          .then(() => {})
          .catch((error) => {});
      }
    }
  });

  return instance;
};

export const requestNotificationPermission = () => {
  if (isSupported()) {
    const messaging = getMessaging(initializeApp(firebaseConfig), process.env.VUE_APP_FIREBASE_PUBLIC_KEY);

    Notification
      .requestPermission()
      .then(() => {
        getToken(messaging).then((token) => {
          instance.saveNotificationToken(token);
        });
      })
      .catch((err) => {});
  }
};

export const PushNotificationsPlugin = {
  install(Vue, options) {
    Vue.prototype.$pushNotifications = usePushNotifications(options);

    const app = initializeApp(firebaseConfig);

    if (isSupported()) {
      const messaging = getMessaging(app);
    }
  }
};
