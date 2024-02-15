const mongoose = require('mongoose');
const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl);
let ChatPrivate:any;
try {
  ChatPrivate = mongoose.model('ChatPrivate');
} catch (error) {

  const chatSchema = new mongoose.Schema({
    to:String,
    from:String,
    fromName:String,
    toName:String,
    message:String,
    time:Number,
    moderatorTo:Boolean,
    moderatorFrom:Boolean,
    avatarTo:String,
    avatarFrom:String
  });
  ChatPrivate = mongoose.model('ChatPrivate', chatSchema);
}


export default ChatPrivate;
