const express = require('express');
const router = express.Router();
const Prize = require('../models/Prize');

/**
 * @swagger
 * components:
 *   schemas:
 *     Prize:
 *       type: object
 *       required:
 *         - tenGiaiThuong
 *         - ngayDatGiai
 *         - loaiGiai
 *         - thanhVienDatGiai
 *       properties:
 *         tenGiaiThuong:
 *           type: string
 *           description: Tên giải thưởng
 *         ngayDatGiai:
 *           type: string
 *           format: date
 *           description: Ngày đạt giải thưởng
 *         loaiGiai:
 *           type: string
 *           description: Loại giải thưởng
 *         thanhVienDatGiai:
 *           type: string
 *           description: Thành viên đạt giải
 *         ghiChu:
 *           type: string
 *           description: Ghi chú thêm (nếu có)
 *         anhDatGiai:
 *           type: string
 *           description: URL ảnh của giải thưởng
 */

/**
 * @swagger
 * /api/prizes:
 *   post:
 *     summary: Thêm một giải thưởng mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prize'
 *     responses:
 *       201:
 *         description: Giải thưởng mới đã được tạo
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/', async (req, res) => {
    try {
        const newPrize = new Prize(req.body);
        await newPrize.save();
        res.status(201).json(newPrize);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/prizes/{id}:
 *   put:
 *     summary: Cập nhật thông tin giải thưởng
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của giải thưởng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prize'
 *     responses:
 *       200:
 *         description: Giải thưởng đã được cập nhật
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedPrize = await Prize.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPrize);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/prizes/{id}:
 *   delete:
 *     summary: Xoá giải thưởng
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của giải thưởng
 *     responses:
 *       200:
 *         description: Giải thưởng đã bị xoá
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/:id', async (req, res) => {
    try {
        await Prize.findByIdAndDelete(req.params.id);
        res.json({ message: 'Prize deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
