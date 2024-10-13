const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - ten
 *         - ngayToChuc
 *         - thoiGianToChuc
 *         - diaDiem
 *         - noiDung
 *         - nganSachChiTieu
 *         - nguoiPhuTrach
 *       properties:
 *         ten:
 *           type: string
 *           description: Tên sự kiện
 *         ngayToChuc:
 *           type: string
 *           format: date
 *           description: Ngày tổ chức sự kiện
 *         thoiGianToChuc:
 *           type: string
 *           description: Thời gian tổ chức sự kiện
 *         diaDiem:
 *           type: string
 *           description: Địa điểm tổ chức sự kiện
 *         noiDung:
 *           type: string
 *           description: Nội dung sự kiện
 *         nganSachChiTieu:
 *           type: number
 *           description: Ngân sách chi tiêu cho sự kiện
 *         nguoiPhuTrach:
 *           type: string
 *           description: Người phụ trách sự kiện
 *         khachMoi:
 *           type: string
 *           description: Khách mời (nếu có)
 */

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Thêm một sự kiện mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Sự kiện mới đã được tạo
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Cập nhật thông tin sự kiện
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sự kiện
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Sự kiện đã được cập nhật
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Xoá sự kiện
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sự kiện
 *     responses:
 *       200:
 *         description: Sự kiện đã bị xoá
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
