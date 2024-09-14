const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const conn = await mongoose.connect('mongodb+srv://nup:doanphanmem123@clusterdoanpm.bdu1v.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDoAnPM',{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error){
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB