const express = require('express');
const testimonialController = require('./controller')

const upload = require('../multer/multer')

const router = express.Router();


router.get('/get-all-testimonial', testimonialController.getAllTestimonial)
router.get('/get-testimonial/:id', testimonialController.getTestimonialById)
router.post('/create-testimonial',  upload.single("image"), testimonialController.createTestimonial);
router.put('/update-testimonial', upload.single("image"),  testimonialController.updateTestimonial);
router.delete('/delete-testimonial/:id', testimonialController.deleteTestimonial);


module.exports = router;