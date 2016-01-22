const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const TaskSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Task', TaskSchema);