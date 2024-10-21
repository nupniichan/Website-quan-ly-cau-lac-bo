const express = require('express');
const router = express.Router();
const Club = require('../models/Club');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Cấu hình multer để upload file, giới hạn kích thước tệp là 5MB
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước tệp là 5MB
});

// Cấu hình để Express phục vụ các tệp tĩnh từ thư mục 'uploads'
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/add-club', upload.single('logo'), async (req, res) => {
  try {
    console.log('Dữ liệu nhận được:', req.body);
    console.log('File logo:', req.file);

    const { ten, linhVucHoatDong, ngayThanhLap, giaoVienPhuTrach, mieuTa, quyDinh } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!ten || !linhVucHoatDong || !ngayThanhLap || !giaoVienPhuTrach) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    const newClub = new Club({
      ten,
      linhVucHoatDong,
      ngayThanhLap,
      giaoVienPhuTrach,
      mieuTa,
      quyDinh,
      logo: req.file ? `/uploads/${req.file.filename}` : undefined
    });

    const savedClub = await newClub.save();
    res.status(201).json(savedClub);
  } catch (error) {
    console.error('Lỗi khi thêm câu lạc bộ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm câu lạc bộ', error: error.message });
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Club'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Club'
 *       404:
 *         description: Không tìm thấy câu lạc bộ
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-club/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID câu lạc bộ không hợp lệ' });
    }

    const club = await Club.findById(id);
    if (!club) {
      return res.status(404).json({ message: 'Không tìm thấy câu lạc bộ' });
    }
    res.status(200).json(club);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin câu lạc bộ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin câu lạc bộ', error: error.message });
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
 *       404:
 *         description: Không tìm thấy câu lạc bộ
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/update-club/:id', upload.single('logo'), async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Dữ liệu nhận được:', req.body);
    console.log('File logo:', req.file);
    console.log('Logo path:', req.file ? `/uploads/${req.file.filename}` : undefined);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID câu lạc bộ không hợp lệ' });
    }

    const { ten, linhVucHoatDong, ngayThanhLap, giaoVienPhuTrach, mieuTa, quyDinh } = req.body;

    const updatedClub = await Club.findByIdAndUpdate(id, {
      ten,
      linhVucHoatDong,
      ngayThanhLap,
      giaoVienPhuTrach,
      mieuTa,
      quyDinh,
      logo: req.file ? `/uploads/${req.file.filename}` : undefined
    }, { new: true });

    if (!updatedClub) {
      return res.status(404).json({ message: 'Không tìm thấy câu lạc bộ' });
    }

    res.json(updatedClub);
  } catch (error) {
    console.error('Lỗi khi cập nhật câu lạc bộ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật câu lạc bộ', error: error.message });
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
 *       404:
 *         description: Không tìm thấy câu lạc bộ
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/delete-club/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID câu lạc bộ không hợp lệ' });
    }

    const club = await Club.findByIdAndDelete(id);
    if (!club) {
      return res.status(404).json({ message: 'Không tìm thấy câu lạc bộ' });
    }
    res.json({ message: 'Câu lạc bộ đã được xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa câu lạc bộ:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa câu lạc bộ', error: error.message });
  }
});

module.exports = router;
