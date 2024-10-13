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
 *         _id:
 *           type: number
 *           description: ID của sự kiện
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
 * /api/add-event:
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/add-event', async (req, res) => {
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
 * /api/get-events:
 *   get:
 *     summary: Lấy danh sách tất cả các sự kiện
 *     responses:
 *       200:
 *         description: Danh sách các sự kiện
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-events', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/get-event/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một sự kiện
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của sự kiện
 *     responses:
 *       200:
 *         description: Chi tiết sự kiện
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-event/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/update-event/{id}:
 *   put:
 *     summary: Cập nhật thông tin sự kiện
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/update-event/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/delete-event/{id}:
 *   delete:
 *     summary: Xoá sự kiện
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của sự kiện
 *     responses:
 *       200:
 *         description: Sự kiện đã bị xoá
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/delete-event/:id', async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
