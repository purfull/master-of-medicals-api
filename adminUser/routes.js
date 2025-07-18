const express = require('express');
const AdminController = require('./controller')

const upload = require('../multer/multer')

const authenticateToken = require('../utils/middleware')
const router = express.Router();


router.get('/get-all-admin',authenticateToken.authenticateToken, AdminController.getAllAdminUser)
router.get('/get-admin/:id', authenticateToken.authenticateToken, AdminController.getAdminUserById)
router.post('/create-admin', upload.array("files", 10), AdminController.createAdminUser);
router.post('/login-admin', AdminController.adminLogin);
router.put('/update-admin', authenticateToken.authenticateToken, upload.array("files", 10), AdminController.updateAdminUser);
router.delete('/delete-admin/:id', authenticateToken.authenticateToken, AdminController.deleteAdminUser);


module.exports = router;