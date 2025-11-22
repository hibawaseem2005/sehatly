import mongoose from "mongoose";
import dotenv from "dotenv";
import OrderDetail from "./models/orderdetails.js"; // adjust path

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("Connected to DB");

  const docs = await OrderDetail.find();
  for (let doc of docs) {
    let updated = false;

    if (doc.order_id) { doc.orderId = doc.order_id; updated = true; }
    if (doc.user_id) { doc.userId = doc.user_id; updated = true; }
    if (doc.med_id) { doc.medicineId = doc.med_id; updated = true; }

    if (updated) {
      await doc.save();
    }
  }

  console.log("Fields updated");
  mongoose.disconnect();
}).catch(console.error);
