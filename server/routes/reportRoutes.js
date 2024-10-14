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
 *         _id:
 *           type: number
 *           description: ID của báo cáo
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
 * /api/add-report:
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/add-report', async (req, res) => {
    try {
        const { clubId, ...reportData } = req.body;
        const newReport = new Report({
            ...reportData,
            club: clubId
        });
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
    
    // Lấy tất cả báo cáo của một CLB cụ thể
    router.get('/get-reports-by-club/:clubId', async (req, res) => {
        try {
            const reports = await Report.find({ club: req.params.clubId });
            res.status(200).json(reports);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

/**
 * @swagger
 * /api/get-reports:
 *   get:
 *     summary: Lấy danh sách tất cả các báo cáo
 *     responses:
 *       200:
 *         description: Danh sách các báo cáo
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-reports', async (req, res) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/get-report/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một báo cáo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của báo cáo
 *     responses:
 *       200:
 *         description: Chi tiết báo cáo
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-report/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/update-report/{id}:
 *   put:
 *     summary: Cập nhật thông tin báo cáo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
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
router.put('/update-report/:id', async (req, res) => {
    try {
        const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(updatedReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/delete-report/{id}:
 *   delete:
 *     summary: Xoá báo cáo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của báo cáo
 *     responses:
 *       200:
 *         description: Báo cáo đã bị xoá
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/delete-report/:id', async (req, res) => {
    try {
        const deletedReport = await Report.findByIdAndDelete(req.params.id);
        if (!deletedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json({ message: 'Report deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
