const mongoose = require('mongoose');
const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl);
let Esports:any;
try {
  Esports = mongoose.model('Esports');
} catch (error) {

  const esportsSchema = new mongoose.Schema({
    gameId:Number,
    active:Boolean,
    completed:Boolean,
    player1:String,
    player2:String,
    name1:String,
    name2:String,
    score1:Number,
    score2:Number,
    game:String,
    console:String,
    amount:Number,
    token:String,
    player1nft:Number,
    player2nft:Number,
    rules:String,
    winner:String,
    accepted:Boolean,
    disputed:Boolean,
    disputer:String,
    mediator:String,
    stream:String,
    canceled:Boolean,
    date:Number,
    dateScored:Number,
    scorer:String,
    txid:String
  });
  esportsSchema.index({ gameId: 1 }, { unique: true });
  Esports = mongoose.model('Esports', esportsSchema);
}


export default Esports;
