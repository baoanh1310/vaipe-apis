import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import prepCtrl from '../controllers/prep.controller'
import upload from '../libs/multer'

const router = express.Router()

router.param('userId', userCtrl.userByID)

router.route('/api/prep/')
  .get(authCtrl.requireSignin, prepCtrl.getStatsPrep)
  .post(authCtrl.requireSignin, upload.single('image'), prepCtrl.create)

router.route('/api/prep/:id')
  .get(authCtrl.requireSignin, prepCtrl.getById)
  .delete(authCtrl.requireSignin, prepCtrl.deleteById)

export default router
