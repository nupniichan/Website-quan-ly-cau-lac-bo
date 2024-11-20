const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const Club = require('../models/Club');
const BudgetAllocation = require('../models/BudgetAllocation');
const Counter = require('../models/Counter');
const mongoose = require('mongoose');

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

        // Lấy ID mới từ counter
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'budgetId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // Kiểm tra xem club có tồn tại không
        const clubDoc = await Club.findById(club);
        if (!clubDoc) {
            return res.status(404).json({ message: 'Không tìm thấy câu lạc bộ' });
        }

        const newBudget = new Budget({
            _id: counter.seq,
            ...budgetData,
            club: clubDoc._id,
            ngay: new Date(budgetData.ngay)
        });

        const savedBudget = await newBudget.save();

        // Cập nhật budget của club
        await Club.findByIdAndUpdate(clubDoc._id, {
            $inc: { 
                budget: Number(budgetData.nguonThu) - Number(budgetData.khoanChiTieu)
            }
        });

        const populatedBudget = await Budget.findById(savedBudget._id)
            .populate('club', 'ten budget');
        
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
            { 
                ...updateData,
                club: club, // club ID sẽ là ObjectId
                ngay: new Date(updateData.ngay)
            },
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
            _id: counter.seq,
            club: clubDoc._id,
            amount: Number(req.body.amount),
            purpose: req.body.purpose,
            allocationDate: new Date(req.body.allocationDate)
        });

        console.log('New allocation data:', newAllocation);

        const savedAllocation = await newAllocation.save();

        // Cập nhật budget của club
        await Club.findByIdAndUpdate(clubDoc._id, {
            $inc: { budget: Number(req.body.amount) }
        });

        const populatedAllocation = await BudgetAllocation.findById(savedAllocation._id)
            .populate('club', 'ten clubId budget');

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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { club, amount, purpose, allocationDate } = req.body;
        
        console.log('Received update data:', { club, amount, purpose, allocationDate });

        // Validate dữ liệu đầu vào
        if (!club || !amount || !purpose || !allocationDate) {
            return res.status(400).json({ 
                message: 'Thiếu thông tin bắt buộc',
                received: { club, amount, purpose, allocationDate }
            });
        }

        // Tìm allocation cũ
        const oldAllocation = await BudgetAllocation.findById(req.params.id);
        if (!oldAllocation) {
            return res.status(404).json({ 
                message: 'Không tìm thấy phân bổ ngân sách',
                id: req.params.id 
            });
        }

        // Kiểm tra club có tồn tại (sử dụng MongoDB ObjectId)
        const clubDoc = await Club.findById(club);
        if (!clubDoc) {
            return res.status(404).json({ 
                message: 'Không tìm thấy câu lạc bộ',
                clubId: club 
            });
        }

        // Tính toán sự chênh lệch
        const difference = Number(amount) - oldAllocation.amount;

        try {
            // Cập nhật phân bổ
            const updatedAllocation = await BudgetAllocation.findByIdAndUpdate(
                req.params.id,
                {
                    club: clubDoc._id,
                    amount: Number(amount),
                    purpose,
                    allocationDate: new Date(allocationDate)
                },
                { new: true, runValidators: true, session }
            ).populate('club', 'ten clubId');

            // Cập nhật budget của club
            await Club.findByIdAndUpdate(
                clubDoc._id,
                { $inc: { budget: difference } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            res.status(200).json(updatedAllocation);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        console.error('Error updating budget allocation:', error);
        res.status(400).json({ 
            message: 'Lỗi khi cập nhật phân bổ ngân sách',
            error: error.message
        });
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

router.get('/club/:clubId', async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const allocations = await BudgetAllocation.find({ club: clubId });
        res.json(allocations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm route mới cho việc lấy phân bổ ngân sách theo clubId
router.get('/budget-allocations/club/:clubId', async (req, res) => {
    try {
        const clubId = req.params.clubId;
        console.log('Fetching allocations for club ID:', clubId);
        
        // Tìm club trước
        const club = await Club.findById(clubId);
        console.log('Found club:', club);
        
        if (!club) {
            return res.status(404).json({ message: 'Không tìm thấy câu lạc bộ' });
        }

        // Tìm allocations với club._id
        const allocations = await BudgetAllocation.find({ club: club._id })
            .populate('club', 'ten clubId');
        console.log('Found allocations:', allocations);
        
        // Log thêm query để debug
        console.log('Query conditions:', { club: club._id });
        
        res.json(allocations);
    } catch (error) {
        console.error('Error in budget-allocations/club:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            message: error.message,
            stack: error.stack 
        });
    }
});

// Thêm route để lấy budget hiện tại của club
router.get('/get-club-budget/:clubId', async (req, res) => {
    try {
        const club = await Club.findById(req.params.clubId);
        if (!club) {
            return res.status(404).json({ message: 'Không tìm thấy câu lạc bộ' });
        }

        // Tính toán tổng thu và chi của tất cả thời gian
        const allBudgets = await Budget.find({ club: req.params.clubId });
        const totalStats = allBudgets.reduce((acc, budget) => {
            acc.totalRevenue += budget.nguonThu;
            acc.totalExpense += budget.khoanChiTieu;
            return acc;
        }, { totalRevenue: 0, totalExpense: 0 });

        res.json({
            budget: club.budget,
            totalStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm route mới để lấy thống kê theo tháng
router.get('/get-monthly-stats/:clubId/:month', async (req, res) => {
    try {
        const { clubId, month } = req.params;
        const [year, monthNum] = month.split('-');
        
        // Tạo ngày đầu và cuối tháng
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0);

        // Tìm tất cả ngân sách trong tháng được chọn
        const budgets = await Budget.find({
            club: clubId,
            ngay: {
                $gte: startDate,
                $lte: endDate
            }
        });

        // Tính tổng thu và chi
        const stats = budgets.reduce((acc, budget) => {
            acc.totalRevenue += budget.nguonThu;
            acc.totalExpense += budget.khoanChiTieu;
            return acc;
        }, { totalRevenue: 0, totalExpense: 0 });

        res.json(stats);
    } catch (error) {
        console.error('Error getting monthly stats:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
