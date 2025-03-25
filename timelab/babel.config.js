module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@": "./", // Match the alias defined in tsconfig.json
        },
      },
    ],
  ],
};
