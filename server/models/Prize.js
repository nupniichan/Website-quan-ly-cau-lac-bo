const mongoose = require('mongoose');

// Schema cho thông tin giải thưởng (Prize)
const prizeSchema = new mongoose.Schema({
    tenGiaiThuong: { type: String, required: true },
    ngayDatGiai: { type: Date, required: true },
    loaiGiai: { type: String, required: true },
    thanhVienDatGiai: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    ghiChu: { type: String },
    anhDatGiai: { type: String }
});

const Prize = mongoose.model('Prize', prizeSchema);
module.exports = Prize;
