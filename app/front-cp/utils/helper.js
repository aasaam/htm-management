class Graph {
  static async apiCall(type, inputData, endpoint, dataObj, inputVar) {
    const { data } = await this.$axios.post('graphql/graphql', {
      query: `${type} (${inputData}) {
          ${endpoint}(
            ${dataObj}
          )
      }`,
      variables: inputVar,
    });
    return data;
  }
}
export default Graph;
