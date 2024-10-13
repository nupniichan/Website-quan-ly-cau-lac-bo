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
 *       properties:
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
 */
// Get all clubs
router.get('/', async (req, res) => {
    try {
        const clubs = await Club.find();
        console.log('Fetched clubs:', clubs); // Debug log
        res.json(clubs);
    } catch (error) {
        console.error('Error fetching clubs:', error.message);
        res.status(500).json({ message: error.message });
    }
});
/**
 * @swagger
 * /api/clubs:
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
// Create a new club
router.post('/', async (req, res) => {
    console.log('Request to create club with data:', req.body); // Debug log
    try {
        const newClub = new Club(req.body);
        await newClub.save();
        console.log('Club created:', newClub); // Debug log
        res.status(201).json(newClub);
    } catch (error) {
        console.error('Error creating club:', error.message); // Log the error
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/clubs/{id}:
 *   put:
 *     summary: Cập nhật thông tin câu lạc bộ
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
router.put('/:id', async (req, res) => {
    console.log(`Request to update club with ID: ${req.params.id} and data:`, req.body); // Debug log
    try {
        const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log('Club updated:', updatedClub); // Debug log
        res.json(updatedClub);
    } catch (error) {
        console.error('Error updating club:', error.message);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/clubs/{id}:
 *   delete:
 *     summary: Xoá câu lạc bộ
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của câu lạc bộ
 *     responses:
 *       200:
 *         description: Câu lạc bộ đã bị xoá
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/:id', async (req, res) => {
    try {
        await Club.findByIdAndDelete(req.params.id);
        res.json({ message: 'Club deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
/**
 * @swagger
 * /api/clubs:
 *   get:
 *     summary: Lấy danh sách tất cả các câu lạc bộ
 *     responses:
 *       200:
 *         description: Danh sách câu lạc bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Club'
 *       500:
 *         description: Lỗi máy chủ
 */

