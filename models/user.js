const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    categories: [{
        type: String,
        required: true,
    }],
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Notes',
    }
]
});

module.exports = mongoose.model('User', userSchema);