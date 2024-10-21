const mongoose = require('mongoose');

// Schema cho thông tin sự kiện (Event)
const eventSchema = new mongoose.Schema({
    ten: { type: String, required: true },
    ngayToChuc: { type: Date, required: true },
    thoiGianBatDau: { type: String, required: true },
    thoiGianKetThuc: { type: String, required: true },
    diaDiem: { type: String, required: true },
    noiDung: { type: String, required: true },
    nganSachChiTieu: { type: Number, required: true },
    nguoiPhuTrach: { type: String, required: true },
    khachMoi: [{ type: String }], // Array of strings for multiple guests
    club: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Club',
        required: true
    },
    trangThai: { type: String, enum: ['choDuyet', 'daDuyet', 'tuChoi'], default: 'choDuyet' }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
