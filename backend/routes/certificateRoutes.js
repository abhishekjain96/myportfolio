const express = require('express');
const router = express.Router();
const {
    getCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate
} = require('../controllers/certificateController');
const authMiddleware = require('../middleware/authMiddleware');

router.route('/')
    .get(getCertificates)
    .post(authMiddleware, createCertificate);

router.route('/:id')
    .put(authMiddleware, updateCertificate)
    .delete(authMiddleware, deleteCertificate);

module.exports = router;