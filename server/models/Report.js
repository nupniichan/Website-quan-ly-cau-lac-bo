const mongoose = require('mongoose');

// Schema cho thông tin báo cáo (Report)
const reportSchema = new mongoose.Schema({
    tenBaoCao: { type: String, required: true },
    ngayBaoCao: { type: Date, required: true },
    nhanSuPhuTrach: { type: String, required: true },
    danhSachSuKien: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    tongNganSachChiTieu: { type: Number, required: true },
    tongThu: { type: Number, required: true },
    ketQuaDatDuoc: { type: String, required: true }
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
