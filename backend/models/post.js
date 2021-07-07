const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    name: {type: String, required: true},
    desc: {type: String, required: true},
    imageUrl: {type: String, required: true}
});

module.exports = mongoose.model('Post', postSchema);