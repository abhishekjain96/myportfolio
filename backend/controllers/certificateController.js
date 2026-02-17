const Certificate = require('../models/Certificate');

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
const getCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find().sort('order');
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create certificate
// @route   POST /api/certificates
// @access  Private
const createCertificate = async (req, res) => {
    try {
        const certificate = new Certificate(req.body);
        await certificate.save();
        res.status(201).json(certificate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private
const updateCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        
        res.json(certificate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private
const deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndDelete(req.params.id);
        
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        
        res.json({ message: 'Certificate deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate
};