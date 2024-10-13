const mongoose = require('mongoose');

// Schema cho thông tin sự kiện (Event)
const eventSchema = new mongoose.Schema({
    ten: { type: String, required: true },
    ngayToChuc: { type: Date, required: true },
    thoiGianToChuc: { type: String, required: true },
    diaDiem: { type: String, required: true },
    noiDung: { type: String, required: true },
    nganSachChiTieu: { type: Number, required: true },
    nguoiPhuTrach: { type: String, required: true },
    khachMoi: { type: String }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
