const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5656,
    jwtSecret: process.env.JWT_SECRET || "icebear",
    tokenLife: 3600, // 1h
    refreshTokenLife: 604800, // 1 week 
    mongoUri: process.env.MONGODB_URI ||
      process.env.MONGO_HOST ||
      'mongodb://' + (process.env.IP || 'localhost') + ':' +
      (process.env.MONGO_PORT || '27017') +
      '/vaipeapis'
  }
  
export default config