module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // This will include both prettier and the plugin
  ],
  plugins: ['prettier'], // Add Prettier plugin if it's not already included in 'extends'
  rules: {
    'prettier/prettier': 'error', // Show prettier errors as ESLint errors
    // Add other rules as needed
  },
};
