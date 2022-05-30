import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import prescriptionCtrl from '../controllers/prescription.controller'

const router = express.Router()

router.param('userId', userCtrl.userByID)

router.route('/api/prescription/')
  .get(authCtrl.requireSignin, prescriptionCtrl.getStatsPrescription)
  // .post(authCtrl.requireSignin, upload.single('image'), prescriptionCtrl.create)
  .post(authCtrl.requireSignin, prescriptionCtrl.create)

router.route('/api/prescription/:id')
  .get(authCtrl.requireSignin, prescriptionCtrl.getById)
  .delete(authCtrl.requireSignin, prescriptionCtrl.deleteById)

export default router
