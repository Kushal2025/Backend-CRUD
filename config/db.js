const mongoose =  require('mongoose');
const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
 useNewUrlParser: true,
      useUnifiedTopology: true,
        });
        console.log("Mongo DB Connected");
        
    } catch (error) {
        console.log("❌ MongoDB connection failed:", error.message);
        
    }
}
module.exports = connectDB;