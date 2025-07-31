const express = require('express');
const Controller = require('./controller')

const router = express.Router();


router.post('/login/:type', Controller.login)
router.post('/check-user/:type', Controller.checkUser)


module.exports = router;