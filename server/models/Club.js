const mongoose = require('mongoose');

// Schema cho thông tin câu lạc bộ (Club)
const clubSchema = new mongoose.Schema({
    ten: { type: String, required: true },
    logo: { type: String },
    linhVucHoatDong: { type: String, required: true },
    thanhVien: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    thanhVienQuanLy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    ngayThanhLap: { type: Date, required: true },
    cacHoatDong: { type: String },
    suKien: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    lichSuHoatDong: { type: String },
    giaoVienPhuTrach: { type: String, required: true }
});

const Club = mongoose.model('Club', clubSchema);
module.exports = Club;
