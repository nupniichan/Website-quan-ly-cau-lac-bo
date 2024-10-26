const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const Club = require('../models/Club');
const BudgetAllocation = require('../models/BudgetAllocation');
const Counter = require('../models/Counter');

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

        // Kiểm tra xem club có tồn tại không
        const clubDoc = await Club.findOne({ _id: Number(club) });
        if (!clubDoc) {
            return res.status(404).json({ message: 'Không tìm thấy câu lạc bộ' });
        }

        const newBudget = new Budget({
            ...budgetData,
            club: clubDoc._id,
            ngay: new Date(budgetData.ngay) // Đảm bảo ngày được parse đúng
        });

        const savedBudget = await newBudget.save();
        
        // Populate thông tin club và trả về
        const populatedBudget = await Budget.findById(savedBudget._id).populate('club', 'ten');
        
        res.status(201).json(populatedBudget);
    } catch (error) {
        console.error('Error adding budget:', error);
        res.status(500).json({ 
            message: 'Lỗi khi thêm ngân sách', 
            error: error.message 
        });
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
        const allocations = await BudgetAllocation.find()
            .populate('club', 'ten clubId')
            .sort({ allocationDate: -1 });
        res.status(200).json(allocations);
    } catch (error) {
        console.error('Error fetching budget allocations:', error);
        res.status(500).json({ message: error.message });
    }
});

// Thêm phân bổ ngân sách mới
router.post('/add-budget-allocation', async (req, res) => {
    try {
        console.log('Received data:', req.body);

        // Lấy ID mới cho BudgetAllocation
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'budgetAllocationId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // Tìm club bằng _id (ObjectId)
        const clubDoc = await Club.findById(req.body.club);
        console.log('Found club:', clubDoc);

        if (!clubDoc) {
            return res.status(404).json({ 
                message: 'Không tìm thấy câu lạc bộ',
                debug: { searchedId: req.body.club }
            });
        }

        const newAllocation = new BudgetAllocation({
            _id: counter.seq, // Thêm _id từ counter
            club: clubDoc._id,
            amount: Number(req.body.amount),
            purpose: req.body.purpose,
            allocationDate: new Date(req.body.allocationDate)
        });

        console.log('New allocation data:', newAllocation);

        const savedAllocation = await newAllocation.save();
        const populatedAllocation = await BudgetAllocation.findById(savedAllocation._id)
            .populate('club', 'ten clubId');

        res.status(201).json(populatedAllocation);
    } catch (error) {
        console.error('Error details:', error);
        res.status(400).json({ 
            message: 'Lỗi khi thêm phân bổ ngân sách',
            error: error.message,
            stack: error.stack
        });
    }
});

// Cập nhật phân bổ ngân sách
router.put('/update-budget-allocation/:id', async (req, res) => {
    try {
        const { club, amount, purpose, allocationDate } = req.body;
        
        // Tìm club bằng clubId
        const clubDoc = await Club.findOne({ clubId: Number(club) });
        if (!clubDoc) {
            return res.status(404).json({ message: 'Không tìm thấy câu lạc bộ' });
        }

        const updatedAllocation = await BudgetAllocation.findByIdAndUpdate(
            req.params.id,
            {
                club: clubDoc._id,
                amount,
                purpose,
                allocationDate: new Date(allocationDate)
            },
            { new: true, runValidators: true }
        ).populate('club', 'ten clubId');

        if (!updatedAllocation) {
            return res.status(404).json({ message: 'Không tìm thấy phân bổ ngân sách' });
        }

        res.status(200).json(updatedAllocation);
    } catch (error) {
        console.error('Error updating budget allocation:', error);
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
