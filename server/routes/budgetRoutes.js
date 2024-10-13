const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

/**
 * @swagger
 * components:
 *   schemas:
 *     Budget:
 *       type: object
 *       required:
 *         - ten
 *         - khoanChiTieu
 *         - nguonThu
 *         - ngay
 *         - thanhVienChiuTrachNhiem
 *         - noiDung
 *       properties:
 *         ten:
 *           type: string
 *           description: Tên ngân sách
 *         khoanChiTieu:
 *           type: number
 *           description: Khoản chi tiêu
 *         nguonThu:
 *           type: number
 *           description: Nguồn thu
 *         ngay:
 *           type: string
 *           format: date
 *           description: Ngày của ngân sách
 *         thanhVienChiuTrachNhiem:
 *           type: string
 *           description: Thành viên chịu trách nhiệm
 *         noiDung:
 *           type: string
 *           description: Nội dung ngân sách
 */

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
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/add-budget', async (req, res) => {
    try {
        const newBudget = new Budget(req.body);
        await newBudget.save();
        res.status(201).json(newBudget);
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
 *           type: string
 *         description: ID của ngân sách
 *     responses:
 *       200:
 *         description: Chi tiết ngân sách
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-budget/:id', async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.status(200).json(budget);
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
 *           type: string
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
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/update-budget/:id', async (req, res) => {
    try {
        const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBudget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.json(updatedBudget);
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
 *           type: string
 *         description: ID của ngân sách
 *     responses:
 *       200:
 *         description: Ngân sách đã bị xoá
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/delete-budget/:id', async (req, res) => {
    try {
        const deletedBudget = await Budget.findByIdAndDelete(req.params.id);
        if (!deletedBudget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.json({ message: 'Budget deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
