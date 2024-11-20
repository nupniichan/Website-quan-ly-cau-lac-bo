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
        const { club, ...memberData } = req.body;

        const clubDoc = await Club.findById(club);

        if (!clubDoc) {
            return res.status(404).json({ message: 'Club not found' });
        }

        const newMember = new Member({
            ...memberData,
            club: clubDoc._id
        });

        await newMember.save();

        // Update the club's thanhVien array
        await Club.findByIdAndUpdate(clubDoc._id, {
            $push: { thanhVien: newMember._id }
        });

        res.status(201).json(newMember);
    } catch (error) {
        console.error('Error adding member:', error);
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
    const { club, ...memberData } = req.body;
    
    const updatedMember = await Member.findOneAndUpdate(
      { maSoHocSinh: req.params.maSoHocSinh },
      { ...memberData, club: club },
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: 'Không tìm thấy thành viên' });
    }

    // Update the member's association with clubs
    if (club) {
      // Remove member from old club
      await Club.updateMany(
        { thanhVien: updatedMember._id },
        { $pull: { thanhVien: updatedMember._id } }
      );

      // Add member to new club
      await Club.findByIdAndUpdate(club, {
        $addToSet: { thanhVien: updatedMember._id }
      });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
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
router.delete('/delete-member/:maSoHocSinh/:clubId', async (req, res) => {
  try {
    const { maSoHocSinh, clubId } = req.params;

    const deletedMember = await Member.findOneAndDelete({ maSoHocSinh: maSoHocSinh });

    if (!deletedMember) {
      return res.status(404).json({ message: 'Không tìm thấy thành viên' });
    }

    // Remove the member from the associated club
    await Club.findByIdAndUpdate(clubId, {
      $pull: { thanhVien: deletedMember._id }
    });

    res.status(200).json({ message: 'Thành viên đã bị xóa', deletedMember });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/get-recent-members:
 *   get:
 *     summary: Lấy danh sách thành viên mới nhất
 *     responses:
 *       200:
 *         description: Danh sách thành viên mới nhất
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/get-recent-members', async (req, res) => {
    try {
        const recentMembers = await Member.find()
            .populate({
                path: 'club',
                select: 'ten'
            })
            .sort({ _id: -1 }) // Sắp xếp theo ID giảm dần (mới nhất trước)
            .limit(10);
        res.status(200).json(recentMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm route mới để kiểm tra thành viên
router.get('/check-member/:clubId/:memberName', async (req, res) => {
    try {
        const { clubId, memberName } = req.params;
        const member = await Member.findOne({
            club: clubId,
            hoTen: memberName
        });
        
        res.status(200).json({
            isMember: !!member,
            message: member ? 'Thành viên hợp lệ' : 'Người này không phải là thành viên của câu lạc bộ'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
