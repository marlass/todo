const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const ProjectSchema   = new Schema({
    name: {type: String, required: true},
    company: {type: String, default: null},
    description: {type: String, default: ''}
});

module.exports = mongoose.model('Project', ProjectSchema);