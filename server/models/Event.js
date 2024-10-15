const mongoose = require('mongoose');
const Counter = require('./Counter');

// Schema cho thông tin sự kiện (Event)
const eventSchema = new mongoose.Schema({
    _id: { type: Number, required: true },  // Sử dụng số thay vì ObjectId cho _id
    ten: { type: String, required: true },
    ngayToChuc: { type: Date, required: true },
    thoiGianToChuc: { type: String, required: true },
    diaDiem: { type: String, required: true },
    noiDung: { type: String, required: true },
    nganSachChiTieu: { type: Number, required: true },
    nguoiPhuTrach: { type: String, required: true },
    khachMoi: { type: String },
    club: { type: Number, ref: 'Club', required: true }  // Sử dụng clubId là số
});


eventSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'eventId' },
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

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
