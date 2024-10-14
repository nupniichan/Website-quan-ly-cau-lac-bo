const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       required:
 *         - maSoHocSinh
 *         - hoTen
 *         - gioiTinh
 *         - lop
 *         - toHopHocTap
 *         - thongTinLienLac
 *         - ngayThamGia
 *         - tinhTrang
 *       properties:
 *         maSoHocSinh:
 *           type: string
 *           description: Mã số học sinh của thành viên
 *         hoTen:
 *           type: string
 *           description: Họ và tên của thành viên
 *         gioiTinh:
 *           type: string
 *           description: Giới tính của thành viên
 *         lop:
 *           type: string
 *           description: Lớp của thành viên
 *         toHopHocTap:
 *           type: string
 *           description: Tổ hợp học tập của thành viên
 *         thongTinLienLac:
 *           type: string
 *           description: Thông tin liên lạc của thành viên
 *         ngayThamGia:
 *           type: string
 *           format: date
 *           description: Ngày thành viên tham gia câu lạc bộ
 *         tinhTrang:
 *           type: string
 *           description: Tình trạng của thành viên
 */

/**
 * @swagger
 * /api/add-member:
 *   post:
 *     summary: Thêm một thành viên mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       201:
 *         description: Thành viên mới đã được tạo
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/add-member', async (req, res) => {
    try {
        const { clubId, ...memberData } = req.body;
        const newMember = new Member({
            ...memberData,
            club: clubId
        });
        await newMember.save();
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * api/get-members-by-club/{id}:
 *   post:
 *     summary: Lấy tất cả thành viên của một CLB cụ thể
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
// Lấy tất cả thành viên của một CLB cụ thể
router.get('/get-members-by-club/:clubId', async (req, res) => {
    try {
        const members = await Member.find({ club: req.params.clubId });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/get-members:
 *   get:
 *     summary: Lấy danh sách tất cả các thành viên
 *     responses:
 *       200:
 *         description: Danh sách các thành viên
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-members', async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/get-member/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một thành viên
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thành viên
 *     responses:
 *       200:
 *         description: Chi tiết thành viên
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-member/:id', async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/update-member/{id}:
 *   put:
 *     summary: Cập nhật thông tin thành viên
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thành viên
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       200:
 *         description: Thành viên đã được cập nhật
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/update-member/:id', async (req, res) => {
    try {
        const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMember) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json(updatedMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/delete-member/{id}:
 *   delete:
 *     summary: Xoá thành viên
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thành viên
 *     responses:
 *       200:
 *         description: Thành viên đã bị xoá
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/delete-member/:id', async (req, res) => {
    try {
        const deletedMember = await Member.findByIdAndDelete(req.params.id);
        if (!deletedMember) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json({ message: 'Member deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
