const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const conn = await mongoose.connect('mongodb+srv://nupniichan01:H1nixHkL97y4F7Sx@clustercnpm.wzxo0.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCNPM',{
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