const mongoose = require('mongoose');
const Counter = require('./Counter');

// Schema cho thông tin câu lạc bộ (Club)
const clubSchema = new mongoose.Schema({
    _id: { type: Number }, 
    ten: { type: String, required: true },
    logo: { type: String },
    linhVucHoatDong: { type: String, required: true },
    thanhVien: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    thanhVienQuanLy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    ngayThanhLap: { type: Date, required: true },
    cacHoatDong: { type: String },
    suKien: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    lichSuHoatDong: { type: String },
    giaoVienPhuTrach: { type: String, required: true },
    mieuTa: { type: String, required: true  }, 
    quyDinh: { type: String, required: true  }
});

// Middleware để tự động tăng ID trước khi lưu Club
clubSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'clubId' }, 
                { $inc: { seq: 1 } }, 
                { new: true, upsert: true } 
            );
            this._id = counter.seq; 
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const Club = mongoose.model('Club', clubSchema);
module.exports = Club;
