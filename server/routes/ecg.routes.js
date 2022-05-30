import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import ecgCtrl from '../controllers/ecg.controller'

const router = express.Router()

router.route('/api/ecg/')
  .get(authCtrl.requireSignin, ecgCtrl.getStatsEcg)
  // .post(authCtrl.requireSignin, upload.single('image'), ecgCtrl.create)
  .post(authCtrl.requireSignin, ecgCtrl.create)

router.route('/api/ecg/:id')
  .get(authCtrl.requireSignin, ecgCtrl.getById)
  .delete(authCtrl.requireSignin, ecgCtrl.deleteById)

router.param('userId', userCtrl.userByID)

export default router
