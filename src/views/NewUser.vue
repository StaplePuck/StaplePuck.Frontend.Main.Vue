<template>
  <div class="container">
    <div class="row align-items-center profile-header">
      <div class="col-md text-center">
        <PageSummary headline="StaplePuck Profile">
          <p>
            Welcome to StaplePuck. In order to continue you will need to define
            a Username that you want to go by and your email address to receive
            updates. Note that the Username is not the same as your team name.
          </p>
        </PageSummary>
      </div>
      <NewUser />
    </div>
  </div>
</template>

<script>
import NewUser from "../components/NewUser.vue";
import PageSummary from "../components/PageSummary.vue";

export default {
  name: "newUser",
  components: {
    NewUser,
    PageSummary
  }
};
</script>
