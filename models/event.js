const mongooes = require('mongoose');

const Schema = mongooes.Schema;

const eventSchema = new Schema ({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    date : {
        type : Date,
        required : true
    }
});

module.exports = mongooes.model('Event', eventSchema);