import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import upload from '../libs/multer'

const router = express.Router()

router.route('/api/users')
  // .get(userCtrl.list)
  .post(userCtrl.create)

router.route('/api/users/reset-password')  
  .post(userCtrl.forgotPassword)

router.route('/api/users/:userId')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  // .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

router.route('/api/users/upload/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, upload.single('image'), userCtrl.imgUpload)

// router.route('/api/avatar/:userId')
//   .post(authCtrl.requireSignin, authCtrl.hasAuthorization, )

router.param('userId', userCtrl.userByID)

export default router
