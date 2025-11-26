import * as mongoose from 'mongoose';
import "dotenv/config"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI as string)
        console.log('MongoDB connected')
    } catch (err) {
        console.error('MongoDB connection failed:');
        console.log(err)
        process.exit(1);
    }
}

export default connectDB;