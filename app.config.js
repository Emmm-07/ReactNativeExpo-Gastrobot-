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
    }
  });