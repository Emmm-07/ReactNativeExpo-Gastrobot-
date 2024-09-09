export default ({ config }) => ({
    ...config,
    extra: {
      firebaseApiKey: process.env.FIREBASE_KEY,
      firebaseAuthDomain: process.env.FIREBASE_DOMAIN,
      firebaseDatabaseUrl: process.env.FIREBASE_DATABASE,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseSenderId: process.env.FIREBASE_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID
    }
  });