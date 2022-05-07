import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import weightRoutes from './routes/weight.routes'
import bloodRoutes from './routes/blood.routes'
import oxyRoutes from './routes/oxy.routes'
import temperatureRoutes from './routes/temperature.routes'
import ecgRoutes from './routes/ecg.routes'
import prescriptionRoutes from './routes/prescription.routes'
import apiRoutes from './routes/docs.routes'

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
//comment out before building for production
// import devBundle from './devBundle'

const CURRENT_WORKING_DIR = process.cwd()
const app = express()

//comment out before building for production
// devBundle.compile(app)

// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
// secure apps by setting various HTTP headers
app.use(helmet())
// enable CORS - Cross Origin Resource Sharing
app.use(cors())

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', weightRoutes)
app.use('/', bloodRoutes)
app.use('/', oxyRoutes)
app.use('/', temperatureRoutes)
app.use('/', ecgRoutes)
app.use('/', prescriptionRoutes)

const swaggerOption = {
  swaggerOptions: {
    preauthorizeApiKey: true
  }}

app.use('/', apiRoutes)
app.use('/hello', (req, res) => { res.send('Icebear')})

// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({"error" : err.name + ": " + err.message})
  }else if (err) {
    res.status(400).json({"error" : err.name + ": " + err.message})
    console.log(err)
  }
})

export default app
