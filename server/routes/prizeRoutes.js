const express = require('express');
const router = express.Router();
const Prize = require('../models/Prize');
const Club = require('../models/Club');  // Đảm bảo đã import model Club


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
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/add-prize', async (req, res) => {
    try {
        const { clubId, ...prizeData } = req.body;

        // Kiểm tra xem CLB có tồn tại không
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Không tìm thấy CLB' });
        }

        // Tạo giải thưởng mới
        const newPrize = new Prize({
            ...prizeData,
            club: clubId  // Liên kết với clubId
        });

        await newPrize.save();  // Lưu giải thưởng
        res.status(201).json(newPrize);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


/**
 * @swagger
 * /api/get-prizes-by-club/{clubId}:
 *   get:
 *     summary: Lấy tất cả giải thưởng của một CLB cụ thể
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của câu lạc bộ
 *     responses:
 *       200:
 *         description: Danh sách giải thưởng của CLB
 *       404:
 *         description: Không tìm thấy giải thưởng cho CLB
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-prizes-by-club/:clubId', async (req, res) => {
    try {
        const prizes = await Prize.find({ club: req.params.clubId });

        if (!prizes || prizes.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy giải thưởng cho CLB' });
        }

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
 *           type: string
 *         description: ID của giải thưởng
 *     responses:
 *       200:
 *         description: Chi tiết giải thưởng
 *       404:
 *         description: Không tìm thấy giải thưởng
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-prize/:id', async (req, res) => {
    try {
        const prize = await Prize.findById(req.params.id);

        if (!prize) {
            return res.status(404).json({ message: 'Không tìm thấy giải thưởng' });
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
 *       404:
 *         description: Không tìm thấy giải thưởng
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/update-prize/:id', async (req, res) => {
    try {
        const { _id, ...updateData } = req.body;

        // Tìm kiếm và cập nhật giải thưởng
        const updatedPrize = await Prize.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedPrize) {
            return res.status(404).json({ message: 'Không tìm thấy giải thưởng' });
        }

        res.status(200).json(updatedPrize);
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
 *           type: string
 *         description: ID của giải thưởng
 *     responses:
 *       200:
 *         description: Giải thưởng đã bị xoá
 *       404:
 *         description: Không tìm thấy giải thưởng
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/delete-prize/:id', async (req, res) => {
    try {
        const deletedPrize = await Prize.findByIdAndDelete(req.params.id);

        if (!deletedPrize) {
            return res.status(404).json({ message: 'Không tìm thấy giải thưởng' });
        }

        res.status(200).json({ message: 'Giải thưởng đã bị xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
