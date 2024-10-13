const mongoose = require('mongoose');
const Counter = require('./Counter');

// Schema cho thông tin giải thưởng (Prize)
const prizeSchema = new mongoose.Schema({
    _id: { type: Number }, // ID tự động tăng
    tenGiaiThuong: { type: String, required: true },
    ngayDatGiai: { type: Date, required: true },
    loaiGiai: { type: String, required: true },
    thanhVienDatGiai: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    ghiChu: { type: String },
    anhDatGiai: { type: String }
});

prizeSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'prizeId' },
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

const Prize = mongoose.model('Prize', prizeSchema);
module.exports = Prize;
