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
 * /api/budgets:
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
router.post('/', async (req, res) => {
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
 * /api/budgets/{id}:
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
router.put('/:id', async (req, res) => {
    try {
        const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBudget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/budgets/{id}:
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
router.delete('/:id', async (req, res) => {
    try {
        await Budget.findByIdAndDelete(req.params.id);
        res.json({ message: 'Budget deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
