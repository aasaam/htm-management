const covertStToArry = {
  methods: {
    manipulateList(value) {
      const splitted = value.split('\n');
      const filtered = splitted.filter(Boolean);
      const trimmed = filtered.map((line) => line.trim());
      const unique = [...new Set(trimmed)];
      return unique;
    },
  },
};
export default covertStToArry;
