import express from 'express'
import authCtrl from '../controllers/auth.controller'
import healthCtrl from '../controllers/health.controller'

const router = express.Router()

router.route('/api/health/')
  .get(authCtrl.requireSignin, healthCtrl.getStats)

export default router
