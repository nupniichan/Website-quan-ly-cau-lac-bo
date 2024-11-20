const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
const Club = require('../models/Club');

// Register a new account
router.post('/register', async (req, res) => {
    try {
        const { userId, name, email, password, role } = req.body; 
        const account = new Account({ userId, name, email, password, role });  
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
// Get all accounts
router.get('/get-accounts', async (req, res) => {
    try {
        // Fetch all accounts where the role is not 'manager'
        const accounts = await Account.find({ role: { $ne: 'manager' } });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: "Error fetching accounts" });
    }
});
// Get account by userId
router.get('/get-account/:userId', async (req, res) => {
    try {
        const { userId } = req.params; // Extract userId from URL parameter
        const account = await Account.findOne({ userId });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.json(account);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching account', error: error.message });
    }
});
router.post('/add-account', async (req, res) => {
    const { userId, name, email, password, role } = req.body;

    // Validation
    if (!userId || !name || !email || !password || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if account with the same userId already exists
        const existingAccount = await Account.findOne({ userId });
        if (existingAccount) {
            return res.status(400).json({ error: "Account with this User ID already exists." });
        }

        // Create new account and save it to the database
        const newAccount = new Account({ userId, name, email, password, role });
        await newAccount.save();

        // Respond with the created account
        res.status(201).json(newAccount);
    } catch (error) {
        console.error('Error adding account:', error);  // Log the error
        res.status(500).json({ message: 'Server error while adding account', error: error.message });
    }
});
router.put('/update-account/:userId', async (req, res) => {
    const { userId } = req.params;
    const { name, email, password, role } = req.body;

    // Validate request body fields
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    try {
        // Check if the account exists first
        const account = await Account.findOne({ userId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Proceed with update
        account.name = name;
        account.email = email;
        account.password = password;
        account.role = role;

        // Save updated account
        await account.save();

        // Return the updated account details
        res.json(account);
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ message: 'Error updating account', error: error.message });
    }
});



// Delete an account
router.delete('/delete-account/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Check if the account exists first
        const account = await Account.findOne({ userId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Delete the account
        await Account.deleteOne({ userId });

        // Return success message
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'Server error while deleting account', error: error.message });
    }
});

// Thêm route mới để kiểm tra tài khoản có đang quản lý CLB đang hoạt động không
router.get('/check-account-clubs/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Tìm các CLB mà user này đang là trưởng ban và còn hoạt động
        const activeClubs = await Club.findOne({
            truongBanCLB: userId,
            tinhTrang: 'Còn hoạt động'
        });

        res.json({
            hasActiveClubs: !!activeClubs
        });
    } catch (error) {
        console.error('Error checking account clubs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Thêm route mới để lấy tất cả học sinh
router.get('/students', async (req, res) => {
    try {
        const students = await Account.find({ role: 'student' });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
});

module.exports = router;
