module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(axios|@axios|react-native|@react-native|@react-navigation)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
};
