const Project = require('./../models/project');

const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const ProjectSchema = require('mongoose').model('Project').schema
const ObjectId = Schema.ObjectId;

const TaskSchema   = new Schema({
    name: {type: String, required: true},
    description: {type: String, default: ''},
    project: [ProjectSchema],
    user: {
        _id: {type: ObjectId, required: true},
        name: {type: String, required: true},
        mail: {type: String, required: true}
    },
    deadline: {type: Date, default: null},
    size: {type: Number, default: 0},
    real_size: {type: Number, default: 0},
    priority: {type: Number, min: 1, default: 5},
    tags: {type: [String], default: []},
    requirements: {type: [String], default: []},
    status: {type: String, default: 'todo'},
    added: {type: Date, default: Date.now()},
    done: {type: Date, default: null},
    cancelled: {type: Date, default: null}
});

module.exports = mongoose.model('Task', TaskSchema);