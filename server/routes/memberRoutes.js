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
 * /api/members:
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
router.post('/', async (req, res) => {
    try {
        const newMember = new Member(req.body);
        await newMember.save();
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/members/{id}:
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
router.put('/:id', async (req, res) => {
    try {
        const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/members/{id}:
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
router.delete('/:id', async (req, res) => {
    try {
        await Member.findByIdAndDelete(req.params.id);
        res.json({ message: 'Member deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
