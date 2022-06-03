import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import medicineReceiptCtrl from '../controllers/medicineReceipt.controller'

const router = express.Router()

router.param('userId', userCtrl.userByID)

router.route('/api/medicineReceipt/')
  .get(authCtrl.requireSignin, medicineReceiptCtrl.getStatsReceipt)
  // .post(authCtrl.requireSignin, upload.single('image'), medicineReceiptCtrl.create)
  .post(authCtrl.requireSignin, medicineReceiptCtrl.create)

router.route('/api/medicineReceipt/:id')
  .get(authCtrl.requireSignin, medicineReceiptCtrl.getById)
  .delete(authCtrl.requireSignin, medicineReceiptCtrl.deleteById)

export default router
