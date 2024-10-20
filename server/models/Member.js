const mongoose = require('mongoose');

// Schema cho thông tin thành viên (Member)
const memberSchema = new mongoose.Schema({
    maSoHocSinh: { type: String, required: true },
    hoTen: { type: String, required: true },
    gioiTinh: { type: String, required: true },
    lop: { type: String, required: true },
    toHopHocTap: { type: String, required: true },
    thongTinLienLac: { type: String, required: true },
    ngayThamGia: { type: Date, required: true },
    vaiTro: { type: String, required: true },
    tinhTrang: { type: String, required: true },
    suKienDaThamGia: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    club: { type: Number, ref: 'Club', required: true }  // Thay đổi ObjectId thành Number
});

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;
