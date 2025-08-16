import express from 'express';
import cors from 'cors';
import foodRouter from './routes/AdminRouter.js';
import connectDB from './configs/db.js';
import userRouter from './routes/UserRouter.js';


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server Started');
});

app.use("/api/food", foodRouter);
app.use(userRouter)

connectDB();

app.listen(3000, () => {
    console.log('Server Running on Port http://localhost:3000');
});
