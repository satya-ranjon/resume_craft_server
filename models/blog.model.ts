import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document{
    title: string;
    content: string;
    image: {
        public_id: string;
        url: string;
    }
    user: Schema.Types.ObjectId;
    tags: string[];
}

const blogSchema=new Schema<IBlog>({
    title: {type: String, required: true},
    content: {type: String, required: true},
    image: {
        public_id: {type: String, required: true},
        url: {type: String, required: true}
    },
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    tags: [{type: String}]
},
{timestamps: true, versionKey: false});

const BlogModel=mongoose.model<IBlog>("Blog", blogSchema);
export default BlogModel;
