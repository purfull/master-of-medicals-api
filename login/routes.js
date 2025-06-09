const express = require('express');
const Controller = require('./controller')

const router = express.Router();


router.post('/login/:type', Controller.login)


module.exports = router;