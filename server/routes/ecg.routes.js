import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import ecgCtrl from '../controllers/ecg.controller'
import upload from '../libs/multer'

const router = express.Router()

router.route('/api/ecg/:userId')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, ecgCtrl.getStatsEcg)
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, upload.single('image'), ecgCtrl.create)

router.route('/api/ecg/:userId/:id')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, ecgCtrl.getById)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, ecgCtrl.deleteById)


router.param('userId', userCtrl.userByID)

export default router
