import 'dotenv/config';

export default {
  "expo": {
    "name": "vac_frontend",
    "slug": "vac_frontend",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/khabanh.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      // "googleServicesFile": "./GoogleService-Info.plist",
      // "bundleIdentifier": "com.mycorp.myapp",
      "supportsTablet": true,
      "infoPlist": {
        "NSAppTransportSecurity": {
          "NSAllowsArbitraryLoads": true
        }
      }
    },
    "android": {
      // "googleServicesFile": "./google-services.json",
      // "package": "com.mycorp.myapp",
      "adaptiveIcon": {
        "foregroundImage": "./assets/khabanh.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ],
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      CLIENT_ID: process.env.CLIENT_ID,
      CLIENT_SECRET: process.env.CLIENT_SECRET,
      BASE_URL: process.env.BASE_URL,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
    }
  }
}
