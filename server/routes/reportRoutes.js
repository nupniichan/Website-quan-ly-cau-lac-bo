const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Club = require('../models/Club');

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
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/add-report', async (req, res) => {
    try {
        const reportData = {
            ...req.body,
            ngayBaoCao: new Date(req.body.ngayBaoCao),
            danhSachSuKien: req.body.danhSachSuKien.map(event => ({
                ...event,
                ngayToChuc: new Date(event.ngayToChuc)
            })),
            danhSachGiai: req.body.danhSachGiai.map(award => ({
                ...award,
                ngayNhanGiai: new Date(award.ngayNhanGiai)
            }))
        };
        const newReport = new Report(reportData);
        await newReport.save();
        res.status(201).json(newReport);
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
 *       404:
 *         description: Không tìm thấy báo cáo
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
 *       404:
 *         description: Không tìm thấy báo cáo
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/update-report/:id', async (req, res) => {
    try {
        const reportData = {
            ...req.body,
            ngayBaoCao: new Date(req.body.ngayBaoCao),
            danhSachSuKien: req.body.danhSachSuKien.map(event => ({
                ...event,
                ngayToChuc: new Date(event.ngayToChuc)
            })),
            danhSachGiai: req.body.danhSachGiai.map(award => ({
                ...award,
                ngayNhanGiai: new Date(award.ngayNhanGiai)
            }))
        };
        const updatedReport = await Report.findByIdAndUpdate(req.params.id, reportData, { new: true });
        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(updatedReport);
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
 *       404:
 *         description: Không tìm thấy báo cáo
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/delete-report/:id/:clubId', async (req, res) => {
    try {
        const deletedReport = await Report.findOneAndDelete({ _id: req.params.id, club: req.params.clubId });
        if (!deletedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/get-reports-by-club/{clubId}:
 *   get:
 *     summary: Lấy danh sách báo cáo của một câu lạc bộ cụ thể
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: number
 *         description: ID của câu lạc bộ
 *     responses:
 *       200:
 *         description: Danh sách báo cáo của câu lạc bộ
 *       404:
 *         description: Không tìm thấy báo cáo cho câu lạc bộ
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-reports-by-club/:clubId', async (req, res) => {
  try {
    const reports = await Report.find({ club: req.params.clubId });
    const formattedReports = reports.map(report => {
      const reportObj = report.toObject();
      return {
        ...reportObj,
        ngayBaoCao: reportObj.ngayBaoCao ? reportObj.ngayBaoCao.toISOString() : null,
        danhSachSuKien: reportObj.danhSachSuKien.map(event => ({
          ...event,
          ngayToChuc: event.ngayToChuc ? event.ngayToChuc.toISOString() : null
        })),
        danhSachGiai: reportObj.danhSachGiai.map(award => ({
          ...award,
          ngayNhanGiai: award.ngayNhanGiai ? award.ngayNhanGiai.toISOString() : null
        }))
      };
    });
    res.status(200).json(formattedReports);
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
});

module.exports = router;
