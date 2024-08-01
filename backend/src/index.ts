import * as dotenv from 'dotenv'
dotenv.config()

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import auth from "./middleware/auth";
import reportRoutes from "./routes/report"
import verifyRoutes from "./routes/verify"

const app = express();

app.use(cors({ credentials: true, }))
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/report', auth, reportRoutes)
app.use('/verify', auth, verifyRoutes)

app.listen(process.env.PORT || 8080, () => {
    console.log('app listening on http://localhost:8080/');
})

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', (error: Error) => console.log(error));


app.get('/protected', auth, (req, res) => {
    res.status(200).json({ message: "This is a protected route" });
});
