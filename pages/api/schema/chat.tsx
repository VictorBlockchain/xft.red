const mongoose = require('mongoose');
const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl);
let Chat:any;
try {
  Chat = mongoose.model('Chat');
} catch (error) {

  const chatSchema = new mongoose.Schema({
    name:String,
    account:String,
    message:String,
    time:Number,
    moderator:Boolean,
    avatar:String
  });
  Chat = mongoose.model('Chat', chatSchema);
}


export default Chat;
