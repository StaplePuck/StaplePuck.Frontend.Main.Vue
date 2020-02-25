<template>
  <div class="container" v-if="cleanedMessages">
    Address the following:
    <b-list-group>
      <b-list-group-item v-for="message in cleanedMessages" variant="danger">
        {{ message }}
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  name: "ServerInputErrors",
  data() {
    return {
      errorListKey: 0
    };
  },
  props: ["graphError"],
  computed: {
    cleanedMessages: function() {
      if (this.graphError == null) {
        return null;
      }
      const errors = this.graphError.graphQLErrors;
      const messages = [];
      var i;
      for (i = 0; i < errors.length; i++) {
        if (errors.hasOwnProperty("functionError")) {
          const customErrors = JSON.parse(errors[i].functionError);
          messages.push(...customErrors.errors[i]);
        } else {
          messages.push(
            errors[i].message.replace("GraphQL.ExecutionError: ", "")
          );
        }
      }
      return messages;
    }
  }
};
</script>
