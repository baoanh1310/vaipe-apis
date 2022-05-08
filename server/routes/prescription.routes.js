import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import prescriptionCtrl from '../controllers/prescription.controller'
import upload from '../libs/multer'

const router = express.Router()

router.route('/api/prescription/:userId')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, prescriptionCtrl.getStatsPrescription)
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, upload.single('image'), prescriptionCtrl.create)

router.route('/api/prescription/:userId/:id')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, prescriptionCtrl.getById)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, prescriptionCtrl.deleteById)

router.param('userId', userCtrl.userByID)

export default router
