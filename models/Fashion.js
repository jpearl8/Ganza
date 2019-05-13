const mongoose = require('mongoose');

const fashionSchema = new mongoose.Schema({
    brand: {
        type: String,
        trim: true,
    },
    item: {
        type: String,
        trim: true,
    },
    assigned: {
        type: Boolean,
    },
    model: {
        type: String,
        trim: true,
    },
    scene: {
        type: Number,
    },
    song: {
        type: Number,
    },
    returned: {
        type: Boolean,
    }
});

module.exports = mongoose.model('Fashion', fashionSchema);
