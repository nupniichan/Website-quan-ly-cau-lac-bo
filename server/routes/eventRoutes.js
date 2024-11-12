const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Club = require('../models/Club');

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - ten
 *         - ngayToChuc
 *         - thoiGianBatDau
 *         - thoiGianKetThuc
 *         - diaDiem
 *         - noiDung
 *         - nganSachChiTieu
 *         - nguoiPhuTrach
 *         - club
 *       properties:
 *         ten:
 *           type: string
 *           description: Tên sự kiện
 *         ngayToChuc:
 *           type: string
 *           format: date
 *           description: Ngày tổ chức sự kiện
 *         thoiGianBatDau:
 *           type: string
 *           description: Thời gian bắt đầu sự kiện
 *         thoiGianKetThuc:
 *           type: string
 *           description: Thời gian kết thúc sự kiện
 *         diaDiem:
 *           type: string
 *           description: Địa điểm tổ chức sự kiện
 *         noiDung:
 *           type: string
 *           description: Nội dung s kiện
 *         nganSachChiTieu:
 *           type: number
 *           description: Ngân sách chi tiêu cho sự kiện
 *         nguoiPhuTrach:
 *           type: string
 *           description: Người phụ trách sự kiện
 *         khachMoi:
 *           type: array
 *           items:
 *             type: string
 *           description: Danh sách khách mời
 *         club:
 *           type: string
 *           description: ID của câu lạc bộ
 *         trangThai:
 *           type: string
 *           enum: [choDuyet, daDuyet, tuChoi]
 *           description: Trạng thái của sự kiện
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
        const { club, khachMoi, ...eventData } = req.body;

        const clubDoc = await Club.findById(club);

        if (!clubDoc) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Kiểm tra ngân sách hiện có
        if (clubDoc.budget < eventData.nganSachChiTieu) {
            return res.status(400).json({ 
                message: 'Ngân sách không đủ để tổ chức sự kiện' 
            });
        }

        const newEvent = new Event({
            ...eventData,
            khachMoi: Array.isArray(khachMoi) ? khachMoi : [khachMoi],
            club: clubDoc._id,
            trangThai: 'choDuyet'
        });

        await newEvent.save();

        // Cập nhật ngân sách của CLB khi sự kiện được duyệt
        if (newEvent.trangThai === 'daDuyet') {
            await Club.findByIdAndUpdate(clubDoc._id, {
                $inc: { 
                    budget: -eventData.nganSachChiTieu,
                    suKien: newEvent._id 
                }
            });
        }

        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ message: error.message });
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
        const event = await Event.findById(req.params.id).populate('club', 'ten');
        if (!event) {
            return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event details:', error);
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
        console.log('API get-events được gọi');
        const events = await Event.find()
            .populate({
                path: 'club',
                select: 'ten'  // Chỉ lấy trường 'ten' của club
            })
            .sort({ ngayToChuc: -1 });
        console.log('Events from DB:', events);
        res.status(200).json(events);
    } catch (error) {
        console.error('Error:', error);
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
        const { khachMoi, ...eventData } = req.body;
        
        // Prepare the update data
        const updateData = {
            ...eventData,
            khachMoi: Array.isArray(khachMoi) ? khachMoi : [khachMoi]
        };

        // Find the event and update it
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
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

        // Remove the event from the associated club
        await Club.findByIdAndUpdate(deletedEvent.club, {
            $pull: { suKien: deletedEvent._id }
        });

        res.status(200).json({ message: 'Sự kiện đã bị xóa', deletedEvent });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: error.message });
    }
});

// Lấy danh sách sự kiện chờ duyệt
router.get('/get-pending-events', async (req, res) => {
    try {
        const pendingEvents = await Event.find({ trangThai: 'choDuyet' })
            .populate({
                path: 'club',
                select: 'ten'  // Chỉ lấy trường 'ten' của club
            })
            .sort({ ngayToChuc: -1 })
            .limit(10);
        res.status(200).json(pendingEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Phê duyệt sự kiện
router.put('/approve-event/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Không tìm thấy sự kiện' });
        }

        // Kiểm tra và cập nhật ngân sách CLB
        const club = await Club.findById(event.club);
        if (club.budget < event.nganSachChiTieu) {
            return res.status(400).json({ 
                message: 'Ngân sách CLB không đủ để tổ chức sự kiện' 
            });
        }

        // Cập nhật trạng thái sự kiện và trừ ngân sách
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id, 
            { trangThai: 'daDuyet' }, 
            { new: true }
        );

        // Trừ ngân sách của CLB
        await Club.findByIdAndUpdate(event.club, {
            $inc: { budget: -event.nganSachChiTieu }
        });

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Từ chối sự kiện
router.put('/reject-event/:id', async (req, res) => {
    try {
        const { lyDoTuChoi } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id, 
            { 
                trangThai: 'tuChoi',
                lyDoTuChoi: lyDoTuChoi 
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

// Thêm route mới này
router.get('/search-events/:clubId', async (req, res) => {
  try {
    const { clubId } = req.params;
    const { query } = req.query;
    const events = await Event.find({
      club: clubId,
      ten: { $regex: query, $options: 'i' }
    }).limit(5);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
