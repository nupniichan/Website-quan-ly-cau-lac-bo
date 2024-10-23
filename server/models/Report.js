const mongoose = require('mongoose');

// Schema cho thông tin báo cáo (Report)
const reportSchema = new mongoose.Schema({
    tenBaoCao: { type: String, required: true },
    ngayBaoCao: { type: Date, required: true },
    nhanSuPhuTrach: { type: String, required: true },
    danhSachSuKien: [{
        tenSuKien: { type: String, required: true },
        nguoiPhuTrach: { type: String, required: true },
        ngayToChuc: { type: Date, required: true }
    }],
    danhSachGiai: [{
        tenGiai: { type: String, required: true },
        nguoiNhanGiai: { type: String, required: true },
        ngayNhanGiai: { type: Date, required: true }
    }],
    tongNganSachChiTieu: { type: Number, required: true },
    tongThu: { type: Number, required: true },
    ketQuaDatDuoc: { type: String, required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true }
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
