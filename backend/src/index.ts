import * as dotenv from 'dotenv'
dotenv.config()

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(cors({ credentials: true, }))
app.use(express.json());

app.listen(process.env.PORT || 8080, () => {
    console.log('app listening on http://localhost:8080/');
})

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', (error: Error) => console.log(error));