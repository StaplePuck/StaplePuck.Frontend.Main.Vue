import firebase from "firebase/app";
import "firebase/app";
import "firebase/messaging";

export default {
  methods: {
    saveNotificationToken(token) {
      const registerNotifTokenURL = "/register-notif-token/";
      const payload = {
        registration_id: token,
        type: "web"
      };
      axios
        .post(registerNotifTokenURL, payload)
        .then((response) => {
          console.log("Successfully saved notification token!");
          console.log(response.data);
        })
        .catch((error) => {
          console.log("Error: could not save notification token");
          if (error.response) {
            console.log(error.response.status);
            // Most of the time a "this field must be unique" error will be returned,
            // meaning that the token already exists in db, which is good.
            if (error.response.data.registration_id) {
              for (let err of error.response.data.registration_id) {
                console.log(err);
              }
            } else {
              console.log("No reason returned by backend");
            }
            // If the request could not be sent because of a network error for example
          } else if (error.request) {
            console.log("A network error occurred.");
            // For any other kind of error
          } else {
            console.log(error.message);
          }
        });
    }
  },
  mounted() {
    var config = {
      apiKey: process.env.VUE_APP_FIREBASE_API_KEY,,
      authDomain: process.env.VUE_APP_FIREBASE_PROJECT_ID + ".firebaseapp.com",
      databaseURL: "https://" + process.env.VUE_APP_FIREBASE_PROJECT_ID + ".firebaseio.com",
      projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VUE_APP_FIREBASE_PROJECT_ID + ".appspot.com",
      messagingSenderId: process.env.VUE_APP_FIREBASE_SENDER_ID
    };
    firebase.initializeApp(config);

    const messaging = firebase.messaging();

    messaging.usePublicVapidKey(process.env.VUE_APP_FIREBASE_PUBLIC_KEY);

    messaging
      .requestPermission()
      .then(() => {
        console.log("Notification permission granted.");
        messaging.getToken().then((token) => {
          console.log("New token created: ", token);
          this.saveNotificationToken(token);
        });
      })
      .catch((err) => {
        console.log("Unable to get permission to notify.", err);
      });

    messaging.onTokenRefresh(function () {
      messaging
        .getToken()
        .then(function (newToken) {
          console.log("Token refreshed: ", newToken);
          this.saveNotificationToken(newToken);
        })
        .catch(function (err) {
          console.log("Unable to retrieve refreshed token ", err);
        });
    });
  }
};
