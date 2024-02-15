const mongoose = require('mongoose');
const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl);
let Token:any;
try {
  Token = mongoose.model('Token');
} catch (error) {

  const tokenSchema = new mongoose.Schema({
    name:String,
    address:String,
    ticker:String,
    decimals:Number,
    avatar:String,
    website:String,
    twitter:String
  });
  Token = mongoose.model('Token', tokenSchema);
}

export default Token;
