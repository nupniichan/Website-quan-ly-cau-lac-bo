const express = require('express');
const router = express.Router();
const Prize = require('../models/Prize');
const Club = require('../models/Club');
const Member = require('../models/Member');
const multer = require('multer');
const path = require('path');
const Report = require('../models/Report');
const mongoose = require('mongoose');

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

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
router.post('/add-prize', upload.single('anhDatGiai'), async (req, res) => {
    try {
        const { club, ...prizeData } = req.body;
        
        // Log để debug
        console.log('Request body:', req.body);
        console.log('File:', req.file);

        // Validate required fields
        if (!prizeData.tenGiaiThuong || !prizeData.ngayDatGiai || !prizeData.loaiGiai || !club) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }

        // Kiểm tra xem giải thưởng đã tồn tại chưa
        const existingPrize = await Prize.findOne({
            tenGiaiThuong: prizeData.tenGiaiThuong,
            ngayDatGiai: new Date(prizeData.ngayDatGiai),
            thanhVienDatGiai: prizeData.thanhVienDatGiai,
            club: club
        });

        if (existingPrize) {
            return res.status(400).json({ message: 'Giải thưởng này đã tồn tại' });
        }

        const newPrize = new Prize({
            ...prizeData,
            club,
            ngayDatGiai: new Date(prizeData.ngayDatGiai),
            anhDatGiai: req.file ? req.file.filename : null,
            thanhVienDatGiai: prizeData.thanhVienDatGiai
        });

        const savedPrize = await newPrize.save();
        
        // Populate thông tin thành viên trước khi trả về
        const populatedPrize = await Prize.findById(savedPrize._id)
            .populate('thanhVienDatGiai', 'hoTen');

        res.status(201).json(populatedPrize);
    } catch (error) {
        console.error('Error adding prize:', error);
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
        const prizes = await Prize.find({ club: req.params.clubId })
            .populate({
                path: 'thanhVienDatGiai',
                select: 'hoTen',
                model: 'Member'
            })
            .sort({ ngayDatGiai: -1 });

        // Log để debug
        console.log('Prizes with members:', prizes);

        if (!prizes || prizes.length === 0) {
            return res.json([]);
        }

        // Format dữ liệu trước khi gửi về client
        const formattedPrizes = prizes.map(prize => ({
            ...prize.toObject(),
            ngayDatGiai: new Date(prize.ngayDatGiai).toISOString().split('T')[0],
            thanhVienHoTen: prize.thanhVienDatGiai?.hoTen || 
                           (typeof prize.thanhVienDatGiai === 'string' ? prize.thanhVienDatGiai : 'N/A')
        }));

        res.status(200).json(formattedPrizes);
    } catch (error) {
        console.error('Error fetching prizes:', error);
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
        const prize = await Prize.findById(req.params.id)
            .populate('thanhVienDatGiai', 'hoTen')
            .populate('club', 'tenCLB');

        if (!prize) {
            return res.status(404).json({ message: 'Không tìm thấy giải thưởng' });
        }

        // Format dữ liệu trước khi gửi về client
        const formattedPrize = {
            ...prize.toObject(),
            thanhVienHoTen: prize.thanhVienDatGiai?.hoTen || 
                           (typeof prize.thanhVienDatGiai === 'string' 
                               ? prize.thanhVienDatGiai 
                               : 'Không xác định')
        };

        res.status(200).json(formattedPrize);
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
router.put('/update-prize/:id', upload.single('anhDatGiai'), async (req, res) => {
    try {
        const { _id, createdAt, updatedAt, __v, ...updateData } = req.body;
        
        // Xử lý ảnh mới nếu có
        if (req.file) {
            updateData.anhDatGiai = req.file.filename;
        }

        // Xử lý club ID - Đảm bảo là string
        if (updateData.club) {
            if (Array.isArray(updateData.club)) {
                updateData.club = updateData.club[0]; // Lấy phần tử đầu tiên nếu là mảng
            }
            updateData.club = new mongoose.Types.ObjectId(updateData.club);
        }

        // Xử lý thanhVienDatGiai
        if (updateData.thanhVienDatGiai) {
            try {
                if (typeof updateData.thanhVienDatGiai === 'string') {
                    updateData.thanhVienDatGiai = new mongoose.Types.ObjectId(updateData.thanhVienDatGiai);
                } else if (updateData.thanhVienDatGiai._id) {
                    updateData.thanhVienDatGiai = new mongoose.Types.ObjectId(updateData.thanhVienDatGiai._id);
                }
            } catch (error) {
                console.error('Error converting thanhVienDatGiai:', error);
                return res.status(400).json({ 
                    message: 'Invalid thanhVienDatGiai format',
                    error: error.message 
                });
            }
        }

        console.log('Updating prize with data:', updateData);

        const updatedPrize = await Prize.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { 
                new: true,
                runValidators: true
            }
        ).populate('thanhVienDatGiai', 'hoTen');

        if (!updatedPrize) {
            return res.status(404).json({ message: 'Không tìm thấy giải thưởng' });
        }

        res.status(200).json(updatedPrize);
    } catch (error) {
        console.error('Error updating prize:', error);
        res.status(500).json({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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
router.delete('/delete-prize/:id/:clubId', async (req, res) => {
    try {
        const deletedPrize = await Prize.findOneAndDelete({ _id: req.params.id, club: req.params.clubId });

        if (!deletedPrize) {
            return res.status(404).json({ message: 'Không tìm thấy giải thưởng hoặc không có quyền xóa' });
        }

        res.status(200).json({ message: 'Giải thưởng đã bị xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/search-prizes/:clubId', async (req, res) => {
  try {
    const { clubId } = req.params;
    const { query } = req.query;
    const prizes = await Prize.find({
      club: clubId,
      tenGiaiThuong: { $regex: query, $options: 'i' }
    }).populate('thanhVienDatGiai', 'hoTen').limit(5);
    res.json(prizes.map(prize => ({
      _id: prize._id,
      tenGiai: prize.tenGiaiThuong,
      nguoiNhanGiai: prize.thanhVienDatGiai ? prize.thanhVienDatGiai.hoTen : 'Không xác định',
      ngayNhanGiai: prize.ngayDatGiai
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kiểm tra giải thưởng có trong báo cáo hay không
router.get('/check-prize-in-reports/:id', async (req, res) => {
    try {
        const prizeId = req.params.id;
        
        // Tìm giải thưởng trong collection Report
        const reportWithPrize = await Report.findOne({ 
            'danhSachGiaiThuong': prizeId 
        });

        // Trả về true nếu giải thưởng có trong báo cáo, false nếu không
        res.status(200).json({
            exists: !!reportWithPrize
        });

    } catch (error) {
        console.error('Error checking prize in reports:', error);
        res.status(500).json({ 
            message: error.message 
        });
    }
});

module.exports = router;
