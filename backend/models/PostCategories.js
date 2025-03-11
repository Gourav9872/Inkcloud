import {Schema , model } from 'mongoose';

const PostCategoriesSchema= new Schema({
    title: { type: String, required: true },
},
{
    timestamps: true        //options: automatically adds 2 fields: created at and updated at
}
);

const PostCategories = model("PostCategories", PostCategoriesSchema);     //model name, schema
export default PostCategories;