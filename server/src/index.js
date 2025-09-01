import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';


dotenv.config();


const app = express();
app.use(express.json());


const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
cors({
origin: CLIENT_URL,
methods: ['GET', 'POST', 'PATCH', 'DELETE'],
allowedHeaders: ['Content-Type', 'Authorization'],
credentials: false 
})
);


app.get('/', (_req, res) => res.send('API OK'));
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);


const PORT = process.env.PORT || 5000;
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})
.catch((err) => {
console.error('Mongo connection error:', err);
process.exit(1);
});