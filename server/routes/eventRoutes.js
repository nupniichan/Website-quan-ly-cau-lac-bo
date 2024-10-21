const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Club = require('../models/Club');  // Import model của Club nếu cần

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
 *         - clubId  // Thêm trường clubId
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
 *         clubId:
 *           type: number
 *           description: ID của câu lạc bộ
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
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
// Thêm sự kiện mới
router.post('/add-event', async (req, res) => {
    try {
        const { clubId, ...eventData } = req.body;

        // Đảm bảo clubId là số và tìm câu lạc bộ
        const club = await Club.findOne({ _id: Number(clubId) });

        if (!club) {
            return res.status(404).json({ message: 'Không tìm thấy CLB' });
        }

        const newEvent = new Event({
            ...eventData,
            club: Number(clubId), // Liên kết sự kiện với clubId là số
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


/**
 * @swagger
 * /api/get-events-by-club/{clubId}:
 *   get:
 *     summary: Lấy tất cả sự kiện của một CLB cụ thể
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của câu lạc bộ
 *     responses:
 *       200:
 *         description: Danh sách sự kiện của CLB
 *       404:
 *         description: Không tìm thấy sự kiện cho CLB
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-event/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);  // Tìm kiếm bằng id là số
        if (!event) {
            return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Các route khác không thay đổi, vì chúng không liên quan trực tiếp đến `clubId`
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

/**
 * @swagger
 * /api/get-events-by-club/{clubId}:
 *   get:
 *     summary: Lấy tất cả sự kiện của một CLB cụ thể
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của câu lạc bộ
 *     responses:
 *       200:
 *         description: Danh sách sự kiện của CLB
 *       404:
 *         description: Không tìm thấy sự kiện cho CLB
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-events-by-club/:clubId', async (req, res) => {
    try {
        // Tìm kiếm các sự kiện dựa trên clubId là số
        const events = await Event.find({ club: req.params.clubId });

        if (!events || events.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sự kiện cho CLB' });
        }

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


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
 * /api/update-event/{id}:
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
 *       404:
 *         description: Không tìm thấy sự kiện
 *       500:
 *         description: Lỗi máy chủ
 */
// Cập nhật sự kiện
router.put('/update-event/:id', async (req, res) => {
    try {
        const { club, ...otherData } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id, 
            { 
                ...otherData,
                club: Number(club), // Đảm bảo club là số
            }, 
            { new: true }
        );
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
        }
        res.status(200).json(updatedEvent);
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
 *           type: string
 *         description: ID của sự kiện
 *     responses:
 *       200:
 *         description: Sự kiện đã bị xoá
 *       404:
 *         description: Không tìm thấy sự kiện
 *       500:
 *         description: Lỗi máy chủ
 */
// Xóa sự kiện
router.delete('/delete-event/:id', async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
        }
        res.status(200).json({ message: 'Sự kiện đã bị xoá' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy danh sách sự kiện chờ duyệt
router.get('/get-pending-events', async (req, res) => {
    try {
        const pendingEvents = await Event.find({ trangThai: 'choDuyet' });
        res.status(200).json(pendingEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Phê duyệt sự kiện
router.put('/approve-event/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { trangThai: 'daDuyet' }, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Từ chối sự kiện
router.put('/reject-event/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { trangThai: 'tuChoi' }, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
