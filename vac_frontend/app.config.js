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
      apiKey: process.env.API_KEY || "AIzaSyDU9U22I0phf2ndMujdOybvU4hseIREeao", 
      authDomain: process.env.AUTH_DOMAIN || "vaccination-realtime-chatting.firebaseapp.com", 
      projectId: process.env.PROJECT_ID || "vaccination-realtime-chatting", 
      storageBucket: process.env.STORAGE_BUCKET || "accination-realtime-chatting.firebasestorage.app", 
      messagingSenderId: process.env.MESSAGING_SENDER_ID || "196595082695", 
      appId: process.env.APP_ID || "1:196595082695:web:a894522d2fd3026f0265e2",
      CLIENT_ID: process.env.CLIENT_ID || 'HxQDtnxYJjTkdRcsicafPK9QqclTYaU8l1CxOQLQ',
      CLIENT_SECRET: process.env.CLIENT_SECRET || '2C5lN4AsEqeCxo1CvSDafff0gNeEqf8FzM2pzfLbp1GOpcqIYAzeTS6Cq0yfHTArHr2QTjHRWgu607PocsfdgUmMOXPePq6P3fsBEGDwGcAnP9YtZIzZ6a3Uwzj00GgE',
      BASE_URL: process.env.BASE_URL || 'http://192.168.1.36:8000/'
    }
  }
}
