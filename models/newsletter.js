//require moonges 
const mongoose = require('mongoose');
// create moonges schema
const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;