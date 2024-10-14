const express = require('express');
const mongoose = require('mongoose');
const clubRoutes = require('./routes/clubRoutes');
const memberRoutes = require('./routes/memberRoutes');
const eventRoutes = require('./routes/eventRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const reportRoutes = require('./routes/reportRoutes');
const prizeRoutes = require('./routes/prizeRoutes');

// Import Swagger UI
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();

// Middleware để parse JSON
app.use(express.json());

// Kết nối MongoDB
const connectDB = async () => {
    try{
        const conn = await mongoose.connect('mongodb+srv://nupniichan01:H1nixHkL97y4F7Sx@clustercnpm.wzxo0.mongodb.net/QuanLyCLB?retryWrites=true&w=majority&appName=ClusterCNPM');
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error){
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Thoát khỏi ứng dụng nếu kết nối thất bại
    }
}


// Kết nối tới mongoDB (sao ông ko kết nối mà vẫn gọi api tới mongo đc hay v)
connectDB()

// Cấu hình Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Club Management API',
            version: '1.0.0',
            description: 'API quản lý câu lạc bộ ヾ(≧▽≦*)o'
        },
        servers: [
            {
                url: 'http://localhost:5500',
            }
        ]
    },
    apis: ['./routes/*.js'], // Đường dẫn tới file chứa các định nghĩa API
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Sử dụng các route
app.use('/api', clubRoutes);
app.use('/api', memberRoutes);
app.use('/api', eventRoutes);
app.use('/api', budgetRoutes);
app.use('/api', reportRoutes);
app.use('/api', prizeRoutes);

// Tích hợp Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Khởi động server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
