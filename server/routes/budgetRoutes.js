const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const Club = require('../models/Club');  // Import đúng model Club

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
        const { clubId, ...budgetData } = req.body;

        // Tìm kiếm club theo clubId là số nguyên
        const club = await Club.findOne({ _id: clubId });
        if (!club) {
            return res.status(404).json({ message: 'Không tìm thấy CLB' });
        }

        // Tạo ngân sách mới và liên kết với club
        const newBudget = new Budget({
            ...budgetData,
            club: clubId  // Liên kết với clubId
        });

        await newBudget.save();
        res.status(201).json(newBudget);
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
        const budgets = await Budget.find({ club: req.params.clubId });

        if (!budgets || budgets.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy ngân sách cho CLB' });
        }

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
        const { _id, ...updateData } = req.body;

        // Tìm kiếm và cập nhật ngân sách bằng ID là số
        const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedBudget) {
            return res.status(404).json({ message: 'Không tìm thấy ngân sách' });
        }

        res.status(200).json(updatedBudget);
    } catch (error) {
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
        const budget = await Budget.findById(req.params.id);
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
        const budgets = await Budget.find({ club: req.params.clubId });

        if (!budgets || budgets.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy ngân sách cho CLB' });
        }

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
router.delete('/delete-budget/:id', async (req, res) => {
    try {
        const deletedBudget = await Budget.findByIdAndDelete(req.params.id);

        if (!deletedBudget) {
            return res.status(404).json({ message: 'Không tìm thấy ngân sách' });
        }

        res.status(200).json({ message: 'Ngân sách đã bị xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
