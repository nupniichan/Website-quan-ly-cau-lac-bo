const mongoose = require('mongoose');
const Counter = require('./Counter'); // Đảm bảo đã import đúng

// Schema cho thông tin câu lạc bộ (Club)
const clubSchema = new mongoose.Schema({
    clubId: { type: Number, unique: true },
    ten: { type: String, required: true },
    logo: { type: String },
    linhVucHoatDong: { type: String, required: true },
    thanhVien: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    ngayThanhLap: { type: Date, required: true },
    giaoVienPhuTrach: { type: String, required: true },
    mieuTa: { type: String, required: true },
    quyDinh: { type: String, required: true },
    truongBanCLB: { type: String, required: true },
    budget: { type: Number, default: 0 },
    tinhTrang: { 
        type: String, 
        enum: ['Còn hoạt động', 'Ngừng hoạt động'],
        default: 'Còn hoạt động',
        required: true 
    }
});

// Middleware để tự động tăng giá trị clubId
clubSchema.pre('save', async function (next) {
    if (this.isNew && !this.clubId) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'clubId' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.clubId = counter.seq; // Gán giá trị seq cho clubId
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const Club = mongoose.model('Club', clubSchema);
module.exports = Club;
