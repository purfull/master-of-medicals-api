const express = require('express');
const queryController = require('./controller')

const upload = require('../multer/multer')

const router = express.Router();


router.get('/get-all-query', queryController.getAllQuery)
router.get('/get-query/:id', queryController.getQueryById)
router.post('/create-query', queryController.createQuery);
router.put('/update-query', queryController.updateQuery);
router.delete('/delete-query/:id', queryController.deleteQuery);


module.exports = router;