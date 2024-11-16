import 'dotenv/config'

export default ({ config }) => ({
    ...config,
    extra: {
      ...config.extra,
      eas: {
        projectId: "7c0fb33b-33c3-4465-86dd-d0e022ec83fa"
      },
      //for arduino iot cloud
      clientId:process.env.CLIENT_ID,
      clientSecret:process.env.CLIENT_SECRET,

      firebaseApiKey: process.env.FIREBASE_KEY,
      firebaseAuthDomain: process.env.FIREBASE_DOMAIN,
      firebaseDatabaseUrl: process.env.FIREBASE_DATABASE,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseSenderId: process.env.FIREBASE_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    }
  });