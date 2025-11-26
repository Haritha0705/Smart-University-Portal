import mongoose, { Document, Schema , Types} from "mongoose";

export interface IStudent extends Document {
    username: string
    email: string
    password: string
    full_name?: string
    phone?: string;
    address?: string;
}
const studentSchema = new Schema<IStudent>(
    {
        username: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        full_name: { type: String },
        phone: { type: String },
        address: { type: String },
    },
    { timestamps: true }
);

const studentModel = mongoose.model<IStudent>('Student', studentSchema);
export default studentModel;
