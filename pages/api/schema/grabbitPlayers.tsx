const mongoose = require('mongoose');
const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl);
let GrabbitPlayers:any;

try {

  GrabbitPlayers = mongoose.model('GrabbitPlayers');

} catch (error) {

  const grabbitPlayersSchema = new mongoose.Schema({ 
    player: String,
    playerName:String,
    playerAvatar:String,
    game:String,
    grabs: Number,
    slaps: Number,
    sneaks: Number,
    grabsUsed:Number,
    slapsUsed:Number,
    sneaksUsed:Number,
    joined:Number,
    expire:Number,
    joinNft:Number,
    winner:Boolean,
    reload:Number,
    active:Boolean,
    completed:Boolean,
    sneakOpen:Boolean,
    type:Number
  });
  
  GrabbitPlayers = mongoose.model('GrabbitPlayers', grabbitPlayersSchema);

}

export default GrabbitPlayers;
