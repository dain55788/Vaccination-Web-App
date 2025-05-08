import 'dotenv/config';

export default {
  "expo": {
    "name": "vac_frontend",
    "slug": "vac_frontend",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/dirty-hand.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSAppTransportSecurity": {
          "NSAllowsArbitraryLoads": true
        }
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/dirty-hand.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    extra: {
      apiKey: process.env.API_KEY, 
      authDomain: process.env.AUTH_DOMAIN, 
      projectId: process.env.PROJECT_ID, 
      storageBucket: process.env.STORAGE_BUCKET, 
      messagingSenderId: process.env.MESSAGING_SENDER_ID, 
      appId: process.env.APP_ID,
      CLIENT_ID: process.env.CLIENT_ID,
      CLIENT_SECRET: process.env.CLIENT_SECRET
    }
  }
}
