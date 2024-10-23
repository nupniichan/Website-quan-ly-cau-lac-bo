const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const Club = require('../models/Club');

/**
 * @swagger
 * /api/add-budget:
 *   post:
 *     summary: Thêm một ngân sách mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Budget'
 *     responses:
 *       201:
 *         description: Ngân sách mới đã được tạo
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/add-budget', async (req, res) => {
    try {
        const { club, ...budgetData } = req.body;

        const clubDoc = await Club.findById(club);
        if (!clubDoc) {
            return res.status(404).json({ message: 'Club not found' });
        }

        const newBudget = new Budget({
            ...budgetData,
            club: clubDoc._id
        });

        await newBudget.save();

        res.status(201).json(newBudget);
    } catch (error) {
        console.error('Error adding budget:', error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/get-budgets-by-club/{clubId}:
 *   get:
 *     summary: Lấy tất cả ngân sách của một CLB cụ thể
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của câu lạc bộ
 *     responses:
 *       200:
 *         description: Danh sách ngân sách của CLB
 *       404:
 *         description: Không tìm thấy ngân sách cho CLB
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-budgets-by-club/:clubId', async (req, res) => {
    try {
        const budgets = await Budget.find({ club: req.params.clubId }).populate('club', 'ten');
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/update-budget/{id}:
 *   put:
 *     summary: Cập nhật thông tin ngân sách
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của ngân sách
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Budget'
 *     responses:
 *       200:
 *         description: Ngân sách đã được cập nhật
 *       404:
 *         description: Không tìm thấy ngân sách
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/update-budget/:id', async (req, res) => {
    try {
        const { club, ...updateData } = req.body;
        
        const updatedBudget = await Budget.findByIdAndUpdate(
            req.params.id,
            { ...updateData, club: club },
            { new: true, runValidators: true }
        ).populate('club', 'ten');

        if (!updatedBudget) {
            return res.status(404).json({ message: 'Không tìm thấy ngân sách' });
        }

        res.status(200).json(updatedBudget);
    } catch (error) {
        console.error('Error updating budget:', error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/get-budgets:
 *   get:
 *     summary: Lấy danh sách tất cả các ngân sách
 *     responses:
 *       200:
 *         description: Danh sách các ngân sách
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-budgets', async (req, res) => {
    try {
        const budgets = await Budget.find();
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


/**
 * @swagger
 * /api/get-budget/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một ngân sách
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của ngân sách
 *     responses:
 *       200:
 *         description: Chi tiết ngân sách
 *       404:
 *         description: Không tìm thấy ngân sách
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-budget/:id', async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id).populate('club', 'ten');
        if (!budget) {
            return res.status(404).json({ message: 'Không tìm thấy ngân sách' });
        }
        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/get-budgets-by-club/{clubId}:
 *   get:
 *     summary: Lấy tất cả ngân sách của một CLB cụ thể
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của câu lạc bộ
 *     responses:
 *       200:
 *         description: Danh sách ngân sách của CLB
 *       404:
 *         description: Không tìm thấy ngân sách cho CLB
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-budgets-by-club/:clubId', async (req, res) => {
    try {
        const budgets = await Budget.find({ club: req.params.clubId }).populate('club', 'ten');
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


/**
 * @swagger
 * /api/delete-budget/{id}:
 *   delete:
 *     summary: Xoá ngân sách
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của ngân sách
 *     responses:
 *       200:
 *         description: Ngân sách đã bị xoá
 *       404:
 *         description: Không tìm thấy ngân sách
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/delete-budget/:id/:clubId', async (req, res) => {
    try {
        const deletedBudget = await Budget.findOneAndDelete({ _id: req.params.id, club: req.params.clubId });

        if (!deletedBudget) {
            return res.status(404).json({ message: 'Không tìm thấy ngân sách' });
        }

        res.status(200).json({ message: 'Ngân sách đã bị xóa', deletedBudget });
    } catch (error) {
        console.error('Error deleting budget:', error);
        res.status(500).json({ message: error.message });
    }
});

// Lấy danh sách phân bổ ngân sách
router.get('/get-budget-allocations', async (req, res) => {
    try {
        const allocations = await BudgetAllocation.find().populate('club', 'ten');
        res.status(200).json(allocations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm phân bổ ngân sách mới
router.post('/add-budget-allocation', async (req, res) => {
    try {
        const newAllocation = new BudgetAllocation(req.body);
        await newAllocation.save();
        res.status(201).json(newAllocation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Cập nhật phân bổ ngân sách
router.put('/update-budget-allocation/:id', async (req, res) => {
    try {
        const updatedAllocation = await BudgetAllocation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAllocation) {
            return res.status(404).json({ message: 'Không tìm thấy phân bổ ngân sách' });
        }
        res.status(200).json(updatedAllocation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Xóa phân bổ ngân sách
router.delete('/delete-budget-allocation/:id', async (req, res) => {
    try {
        const deletedAllocation = await BudgetAllocation.findByIdAndDelete(req.params.id);
        if (!deletedAllocation) {
            return res.status(404).json({ message: 'Không tìm thấy phân bổ ngân sách' });
        }
        res.status(200).json({ message: 'Phân bổ ngân sách đã bị xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
