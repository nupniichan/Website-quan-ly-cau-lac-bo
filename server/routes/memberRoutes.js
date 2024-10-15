const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Club = require('../models/Club');  // Thêm dòng này để import mô hình Club


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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/add-member', async (req, res) => {
    try {
        const { clubId, ...memberData } = req.body;

        // Tìm kiếm câu lạc bộ dựa trên _id là số
        const club = await Club.findById(clubId);  // Sử dụng findById thay vì findOne

        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Tạo thành viên mới và liên kết với club
        const newMember = new Member({
            ...memberData,
            club: club._id  // Liên kết với ObjectId của Club
        });

        await newMember.save();
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




/**
 * @swagger
 * /api/get-members-by-club/{clubId}:
 *   get:
 *     summary: Lấy tất cả thành viên của một CLB cụ thể
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của câu lạc bộ
 *     responses:
 *       200:
 *         description: Danh sách thành viên của CLB
 *       404:
 *         description: Không tìm thấy thành viên cho CLB
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-members-by-club/:clubId', async (req, res) => {
    try {
        const members = await Member.find({ club: req.params.clubId });
        if (!members || members.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thành viên cho CLB' });
        }
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
 *       404:
 *         description: Không tìm thấy thành viên
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-member/:maSoHocSinh', async (req, res) => {
    try {
        // Tìm kiếm thành viên dựa trên maSoHocSinh
        const member = await Member.findOne({ maSoHocSinh: req.params.maSoHocSinh });

        if (!member) {
            return res.status(404).json({ message: 'Không tìm thấy thành viên' });
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
 *       404:
 *         description: Không tìm thấy thành viên
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/update-member/:maSoHocSinh', async (req, res) => {
    try {
        // Tìm kiếm thành viên dựa trên maSoHocSinh
        const updatedMember = await Member.findOneAndUpdate(
            { maSoHocSinh: req.params.maSoHocSinh },  // Tìm kiếm bằng maSoHocSinh
            req.body,  // Dữ liệu cập nhật
            { new: true }  // Trả về bản ghi đã cập nhật
        );

        if (!updatedMember) {
            return res.status(404).json({ message: 'Không tìm thấy thành viên' });
        }

        res.status(200).json(updatedMember);  // Trả về thành viên đã cập nhật
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
 *       404:
 *         description: Không tìm thấy thành viên
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/delete-member/:maSoHocSinh', async (req, res) => {
    try {
        // Tìm kiếm và xóa thành viên dựa trên maSoHocSinh
        const deletedMember = await Member.findOneAndDelete({ maSoHocSinh: req.params.maSoHocSinh });

        if (!deletedMember) {
            return res.status(404).json({ message: 'Không tìm thấy thành viên' });
        }

        res.status(200).json({ message: 'Thành viên đã bị xoá' });  // Xóa thành viên thành công
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
