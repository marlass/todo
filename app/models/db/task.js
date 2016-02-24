const Project = require('./project');

const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const ProjectSchema = require('mongoose').model('Project').schema
const user = require('./../user');
const ObjectId = Schema.ObjectId;

const taskSchema   = new Schema({
    name: {type: String, required: true},
    description: {type: String, default: ''},
    project: ProjectSchema,
    user: {type: String,
           required: true,
           validate: [ function(name, cb){
                user.get(name, function(err, user){
                    cb(err === null);
                })}, 'User not exist']},
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

taskSchema.plugin(require('mongoose-beautiful-unique-validation'));

module.exports = mongoose.model('Task', taskSchema);