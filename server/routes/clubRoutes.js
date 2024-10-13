const express = require('express');
const router = express.Router();
const Club = require('../models/Club');

/**
 * @swagger
 * components:
 *   schemas:
 *     Club:
 *       type: object
 *       required:
 *         - ten
 *         - linhVucHoatDong
 *         - ngayThanhLap
 *         - giaoVienPhuTrach
 *         - truongBanCLB
 *       properties:
 *         _id:
 *           type: number
 *           description: ID của câu lạc bộ
 *         ten:
 *           type: string
 *           description: Tên của câu lạc bộ
 *         logo:
 *           type: string
 *           description: URL của logo câu lạc bộ
 *         linhVucHoatDong:
 *           type: string
 *           description: Lĩnh vực hoạt động của câu lạc bộ
 *         ngayThanhLap:
 *           type: string
 *           format: date
 *           description: Ngày thành lập câu lạc bộ
 *         giaoVienPhuTrach:
 *           type: string
 *           description: Tên giáo viên phụ trách câu lạc bộ
 *         truongBanCLB:
 *           type: string
 *           description: Tên trưởng ban quản lý của câu lạc bộ
 *         mieuTa:
 *           type: string
 *           description: Miêu tả câu lạc bộ
 *         quyDinh:
 *           type: string
 *           description: Quy định của câu lạc bộ
 */

/**
 * @swagger
 * /api/add-club:
 *   post:
 *     summary: Tạo một câu lạc bộ mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Club'
 *     responses:
 *       201:
 *         description: Câu lạc bộ đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Club'
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/add-club', async (req, res) => {
    try {
        const newClub = new Club(req.body);
        await newClub.save();
        res.status(201).json(newClub);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/get-clubs:
 *   get:
 *     summary: Lấy danh sách tất cả các câu lạc bộ
 *     responses:
 *       200:
 *         description: Danh sách các câu lạc bộ
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-clubs', async (req, res) => {
    try {
        const clubs = await Club.find();
        res.status(200).json(clubs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/get-club/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một câu lạc bộ
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của câu lạc bộ
 *     responses:
 *       200:
 *         description: Chi tiết câu lạc bộ
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-club/:id', async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }
        res.status(200).json(club);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/update-club/{id}:
 *   put:
 *     summary: Cập nhật thông tin câu lạc bộ
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của câu lạc bộ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Club'
 *     responses:
 *       200:
 *         description: Câu lạc bộ đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Club'
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/update-club/:id', async (req, res) => {
    try {
        const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClub) {
            return res.status(404).json({ message: 'Club not found' });
        }
        res.json(updatedClub);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/delete-club/{id}:
 *   delete:
 *     summary: Xoá câu lạc bộ
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của câu lạc bộ
 *     responses:
 *       200:
 *         description: Câu lạc bộ đã bị xoá
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/delete-club/:id', async (req, res) => {
    try {
        const deletedClub = await Club.findByIdAndDelete(req.params.id);
        if (!deletedClub) {
            return res.status(404).json({ message: 'Club not found' });
        }
        res.json({ message: 'Club deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
