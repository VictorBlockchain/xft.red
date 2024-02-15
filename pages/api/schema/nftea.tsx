const mongoose = require('mongoose');
const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl);
let NFTea:any;
try {
  NFTea = mongoose.model('NFTea');
} catch (error) {

  const NFTeaSchema = new mongoose.Schema({
    id:Number,
    ipfs:String,
    image:String
  });
  NFTea = mongoose.model('NFTea', NFTeaSchema);
}


export default NFTea;
