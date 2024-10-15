const mongoose = require('mongoose');
const Counter = require('./Counter'); // Import Counter để tự động tăng ID

// Schema cho thông tin báo cáo (Report)
const reportSchema = new mongoose.Schema({
    _id: { type: Number, required: true }, // ID là số nguyên, tự động tăng
    tenBaoCao: { type: String, required: true },
    ngayBaoCao: { type: Date, required: true },
    nhanSuPhuTrach: { type: String, required: true },
    danhSachSuKien: [{ type: Number }],  // Mảng số nguyên để liên kết với sự kiện
    tongNganSachChiTieu: { type: Number, required: true },
    tongThu: { type: Number, required: true },
    ketQuaDatDuoc: { type: String, required: true },
    club: { type: Number, ref: 'Club', required: true }  // Liên kết với clubId là số nguyên
});

// Sử dụng pre-save hook để tự động tăng giá trị _id
reportSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'reportId' },  // Khởi tạo counter với _id là 'reportId'
                { $inc: { seq: 1 } },  // Tăng giá trị seq
                { new: true, upsert: true }  // Nếu không có thì tạo mới
            );
            this._id = counter.seq;  // Gán giá trị seq cho _id của Report
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
