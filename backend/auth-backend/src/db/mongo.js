import mongoose from "mongoose";

const mongoURI = "mongodb+srv://bletemorina_db_fitnes:SyljC456mAsdm3vV@cluster0.u03sheh.mongodb.net/fitness-app?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

export default mongoose;
