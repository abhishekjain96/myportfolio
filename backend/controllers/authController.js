const jwt = require('jsonwebtoken');

// @desc    Authenticate admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        console.log('Login attempt - Username:', username);
        console.log('Login attempt - Password:', password);
        console.log('Env Username:', process.env.ADMIN_USERNAME);
        console.log('Env Password:', process.env.ADMIN_PASSWORD);
        
        // Direct comparison
        if (username === 'abhi@1234' && password === 'abhi@1234') {
            
            const token = jwt.sign(
                { username: username },
                'your-secret-key-12345',
                { expiresIn: '7d' }
            );

            console.log('✅ Login success');
            res.json({ 
                success: true,
                token,
                message: 'Login successful' 
            });
        } else {
            console.log('❌ Login failed');
            res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// @desc    Verify token (simplified)
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = (req, res) => {
    // Always return success for testing
    res.json({ 
        valid: true, 
        user: { username: 'admin' } 
    });
};

module.exports = {
    login,
    verifyToken
};