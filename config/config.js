const fs = require('fs');
const path = require('path');

const ACCESS_TOKEN_PUBLIC_KEY = fs.readFileSync('/mnt/disk1/home/aiotlab/projects/baoanh/vaipe-apis/config/access_token.public.key', 'utf8');
const ACCESS_TOKEN_PRIVATE_KEY = fs.readFileSync('/mnt/disk1/home/aiotlab/projects/baoanh/vaipe-apis/config/access_token.private.key', 'utf8');
const REFRESH_TOKEN_PUBLIC_KEY = fs.readFileSync('/mnt/disk1/home/aiotlab/projects/baoanh/vaipe-apis/config/refresh_token.public.key', 'utf8');
const REFRESH_TOKEN_PRIVATE_KEY = fs.readFileSync('/mnt/disk1/home/aiotlab/projects/baoanh/vaipe-apis/config/refresh_token.private.key', 'utf8');

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5656,
    jwtSecret: process.env.JWT_SECRET || ACCESS_TOKEN_PRIVATE_KEY,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || REFRESH_TOKEN_PRIVATE_KEY,
    accessPublicKey: ACCESS_TOKEN_PUBLIC_KEY,
    refreshPublicKey: REFRESH_TOKEN_PUBLIC_KEY,
    tokenLife: 3600, // 1h
    refreshTokenLife: 604800, // 1 week 
    mongoUri: process.env.MONGODB_URI ||
      process.env.MONGO_HOST ||
      'mongodb://' + (process.env.IP || 'localhost') + ':' +
      (process.env.MONGO_PORT || '27017') +
      '/vaipeapis'
  }
  
export default config