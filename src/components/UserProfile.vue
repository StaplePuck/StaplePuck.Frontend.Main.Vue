<template>
  <div class="container">
    <div>
        Feel free to update your email address
        <p style="color:red;">
            
        </p>
    </div>
  </div>
</template>

<script>
import { QUERY_USER_PROFILE } from "../constants/graphQLqueries/graphQLqueries"

export default {
  name: "UserProfile",
  data () {
    return {
      currentUser: []
    }
  },
  apollo: {
    currentUser: {
      query: QUERY_USER_PROFILE
    }
  }
};
</script>