const mongoose = require('mongoose');
const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl);
let Grabbit:any;
try {
  Grabbit = mongoose.model('Grabbit');
} catch (error) {

  const grabbitSchema = new mongoose.Schema({
    active:Boolean,
    nft2Play: Number,
    nft2PlayContract:String,
    nft2PlayLabel:Number,
    token2PlayContract:String,
    token2PlayBalance:Number,
    ahpReferralCount:Number,
    creator: String,
    grabs: Number,
    slaps: Number,
    sneaks: Number,
    winner:String,
    winnerName:String,
    winnerAvatar:String,
    start:Number,
    startPlay:Number,
    end:Number,
    players:Array,
    playersMax:Number,
    playersMin:Number,
    playersReady:Number,
    prize:String,
    prizeValue:Number,
    prizeType:Number,
    prizeNftea:Number,
    prizeContract:String,
    prizePaid:Boolean,
    prizeTxid:String,
    practice:Boolean,
    title:String,
    image:String,
    slapper:String,
    story:String,
    type:Number,
    timer:String,
    grabTime:Number,
    lastGrabber:String,
    lastGrabTime:Number,
    completed:Boolean,
    canGrab:Boolean,
    location: {
      type: { type: String, enum: ['Point']},
      coordinates: { type: [Number]},
    },
  });
  Grabbit = mongoose.model('Grabbit', grabbitSchema);
}


export default Grabbit;
