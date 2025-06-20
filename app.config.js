module.exports = {
  expo: {
    name: "Happistaa",
    slug: "happistaa-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#F0F4F8"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.happistaa.mobile"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#F0F4F8"
      },
      package: "com.happistaa.mobile"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-av",
      "expo-speech"
    ]
  }
};