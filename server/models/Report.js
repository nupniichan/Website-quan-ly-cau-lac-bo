const mongoose = require('mongoose');
const Counter = require('./Counter');

// Schema cho thông tin báo cáo (Report)
const reportSchema = new mongoose.Schema({
    _id: { type: Number }, // ID tự động tăng
    tenBaoCao: { type: String, required: true },
    ngayBaoCao: { type: Date, required: true },
    nhanSuPhuTrach: { type: String, required: true },
    danhSachSuKien: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    tongNganSachChiTieu: { type: Number, required: true },
    tongThu: { type: Number, required: true },
    ketQuaDatDuoc: { type: String, required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true }
});

reportSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'reportId' },
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

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
