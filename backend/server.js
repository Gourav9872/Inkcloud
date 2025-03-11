import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import path from "path";
import cors from "cors";
import { errorResponseHandler, invalidPathHandler } from "./middleware/errorHandler";

//Routes
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import postCategoriesRoutes from './routes/postCategoriesRoutes';

dotenv.config();
connectDB();
const app=express(); //instance of express package
app.use(express.json()); //middleware wherein if frontend sends .json, it will be able to parse it

app.get('/',(req,res)=>{
    res.send("Server is running... ");
})



app.use(cors({
    exposedHeaders: ['x-filter', 'x-totalcount', 'x-currentpage', 'x-pagesize', 'x-totalpagecount']
}));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/post-categories', postCategoriesRoutes);
//static assets
app.use('/uploads',express.static(path.join(__dirname,"/uploads")));

app.use(invalidPathHandler);
app.use(errorResponseHandler);

const PORT=process.env.PORT || 5001;

app.listen(PORT,()=> console.log(`server is running on port ${PORT}`));