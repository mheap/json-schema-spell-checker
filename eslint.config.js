import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

export default [
  eslintPluginPrettier,
  {
    rules: {
      curly: ["error", "all"],
    },
  },
];
