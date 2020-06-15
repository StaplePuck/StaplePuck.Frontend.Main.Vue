export function DisplayErrors(bvToast, graphError) {
  if (graphError == null) {
    return null;
  }
  const errors = graphError.graphQLErrors;
  if (errors == null) {
    return null;
  }
  var i;
  let blah = [];
  for (i = 0; i < errors.length; i++) {
    if (errors.hasOwnProperty("functionError")) {
      console.log(customErrors.errors[i]);
      bvToast.toast(customErrors.errors[i], {
        title: "Warning",
        autoHideDelay: 5000,
        variant: "error",
        toaster: "b-toaster-top-center",
        appendToast: true
      });
    } else {
      blah.push(errors[i].message.replace("GraphQL.ExecutionError: ", ""));
    }
  }
  return blah;
}
