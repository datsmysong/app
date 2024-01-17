// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Add support for importing files with the extension '.mjs' and '.cjs' for compatibility with
//  - react-hook-form
module.exports = async () => {
  const {
    resolver: { sourceExts },
  } = config;

  return {
    ...config,
    resolver: {
      ...config.resolver,
      sourceExts: [...sourceExts, "mjs", "cjs"],
    },
  };
};
