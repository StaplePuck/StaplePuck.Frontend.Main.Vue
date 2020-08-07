<template>
  <div class="container">
    <h1>Push Notifications</h1>
    <p class="lead">
      You can receive scoring updates for your team through push notifications.
    </p>
    <p>
      Push notifications only work on Android or on the desktop using Chrome or
      new versions of Edge. The technology leveraged to provide push
      notifications is through Progressive Web App (PWA). PWAs can run on
      iPhones, but Apple is slow to embrace push notifications on PWAs. To get
      push notifications you will need to install the site as an App on your
      phone by doing the following:
    </p>
    <ol>
      <li>
        In Chrome navigate to
        <a href="https://www.staplepuck.com">StaplePuck</a>
      </li>
      <li>
        If prompted at the bottom of the page Add
        <strong>StaplePuck to Home Screen</strong> or in the navigation bar
        click the <strong>…</strong> and choose
        <strong>Add to Home screen</strong>
      </li>
      <li>
        Navigate to your Apps and home the <strong>StaplePuck</strong> app
      </li>
      <li>Click <strong>Login</strong></li>
      <li>
        Login using the credentials you provided to setup your team
      </li>
      <li>
        You should be prompted to provide consent to receive push notifications.
        Accept this prompt
      </li>
    </ol>
    <p>
      From here on out you should receive notifications when someone on your
      team scores. You can disable or turn on push notifications in the My
      Profile page.
    </p>
  </div>
</template>

<script>
import AllLeagues from "@/components/AllLeagues.vue";

export default {
  name: "pushInfo",
  components: {}
};
</script>
