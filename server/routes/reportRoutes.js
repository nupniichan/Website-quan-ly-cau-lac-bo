const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       required:
 *         - tenBaoCao
 *         - ngayBaoCao
 *         - nhanSuPhuTrach
 *         - danhSachSuKien
 *         - tongNganSachChiTieu
 *         - tongThu
 *         - ketQuaDatDuoc
 *       properties:
 *         tenBaoCao:
 *           type: string
 *           description: Tên báo cáo
 *         ngayBaoCao:
 *           type: string
 *           format: date
 *           description: Ngày báo cáo
 *         nhanSuPhuTrach:
 *           type: string
 *           description: Nhân sự phụ trách báo cáo
 *         danhSachSuKien:
 *           type: array
 *           items:
 *             type: string
 *           description: Danh sách sự kiện trong báo cáo
 *         tongNganSachChiTieu:
 *           type: number
 *           description: Tổng ngân sách chi tiêu
 *         tongThu:
 *           type: number
 *           description: Tổng thu nhập
 *         ketQuaDatDuoc:
 *           type: string
 *           description: Kết quả đạt được trong báo cáo
 */

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Thêm một báo cáo mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'
 *     responses:
 *       201:
 *         description: Báo cáo mới đã được tạo
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/', async (req, res) => {
    try {
        const newReport = new Report(req.body);
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/reports/{id}:
 *   put:
 *     summary: Cập nhật thông tin báo cáo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của báo cáo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'
 *     responses:
 *       200:
 *         description: Báo cáo đã được cập nhật
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Xoá báo cáo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của báo cáo
 *     responses:
 *       200:
 *         description: Báo cáo đã bị xoá
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/:id', async (req, res) => {
    try {
        await Report.findByIdAndDelete(req.params.id);
        res.json({ message: 'Report deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
