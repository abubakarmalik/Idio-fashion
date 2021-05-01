// require install moudels
const mongoose = require('mongoose');

// contect the mongo db
mongoose.connect("mongodb://localhost:27017/Ecomsite" , { useNewUrlParser: true }, (err) => {
    if(!err){
        console.log('Database connection successfully');
    }else{
        console.log('Error to connect the Database' + JSON.stringify(err, undefined, 2));
    }
});

// export the mongoose
module.exports = mongoose;