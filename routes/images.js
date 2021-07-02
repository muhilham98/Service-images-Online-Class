const express = require('express');
const router = express.Router();
const apiImageController = require('../controllers/apiImageController');
//const { upload, uploadMultiple } = require('../middlewares/multer');


/* GET users listing. */
router.post('/', apiImageController.addImages);
router.get('/', apiImageController.getImages);
router.delete('/:id', apiImageController.deleteImages);

module.exports = router;
