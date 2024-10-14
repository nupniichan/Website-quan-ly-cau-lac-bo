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
 *         _id:
 *           type: number
 *           description: ID của giải thưởng
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
 * /api/add-prize:
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prize'
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/add-prize', async (req, res) => {
    try {
        const { clubId, ...prizeData } = req.body;
        const newPrize = new Prize({
            ...prizeData,
            club: clubId
        });
        await newPrize.save();
        res.status(201).json(newPrize);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/get-prizes-by-club/{clubId}:
 *   post:
 *     summary: Lấy tất cả giải thưởng của một CLB cụ thể
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Budget'
 *     responses:
 *       201:
 *         description: Lấy thành công
 *       500:
 *         description: Lỗi máy chủ
 */
// Lấy tất cả giải thưởng của một CLB cụ thể
router.get('/get-prizes-by-club/:clubId', async (req, res) => {
    try {
        const prizes = await Prize.find({ club: req.params.clubId });
        res.status(200).json(prizes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
/**
 * @swagger
 * /api/get-prizes:
 *   get:
 *     summary: Lấy danh sách tất cả các giải thưởng
 *     responses:
 *       200:
 *         description: Danh sách các giải thưởng
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-prizes', async (req, res) => {
    try {
        const prizes = await Prize.find();
        res.status(200).json(prizes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/get-prize/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một giải thưởng
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của giải thưởng
 *     responses:
 *       200:
 *         description: Chi tiết giải thưởng
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-prize/:id', async (req, res) => {
    try {
        const prize = await Prize.findById(req.params.id);
        if (!prize) {
            return res.status(404).json({ message: 'Prize not found' });
        }
        res.status(200).json(prize);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/update-prize/{id}:
 *   put:
 *     summary: Cập nhật thông tin giải thưởng
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
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
router.put('/update-prize/:id', async (req, res) => {
    try {
        const updatedPrize = await Prize.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPrize) {
            return res.status(404).json({ message: 'Prize not found' });
        }
        res.json(updatedPrize);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/delete-prize/{id}:
 *   delete:
 *     summary: Xoá giải thưởng
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của giải thưởng
 *     responses:
 *       200:
 *         description: Giải thưởng đã bị xoá
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/delete-prize/:id', async (req, res) => {
    try {
        const deletedPrize = await Prize.findByIdAndDelete(req.params.id);
        if (!deletedPrize) {
            return res.status(404).json({ message: 'Prize not found' });
        }
        res.json({ message: 'Prize deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
