const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const jwt = require('jsonwebtoken');

// Register a new account
router.post('/register', async (req, res) => {
    try {
        const { userId, email, password, role } = req.body; 
        const account = new Account({ userId, email, password, role });  
        await account.save();
        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;  
        const account = await Account.findOne({ email }); 
        if (!account) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await account.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: account.userId, role: account.role }, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', { expiresIn: '6h' });
        res.json({ message: 'Login successful', role: account.role, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
