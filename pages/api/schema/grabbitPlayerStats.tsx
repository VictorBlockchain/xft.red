const mongoose = require('mongoose');
const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl);
let GrabbitPlayerStats:any;

try {
  
  GrabbitPlayerStats = mongoose.model('GrabbitPlayerStats');

} catch (error) {

  const grabbitPlayerStatsSchema = new mongoose.Schema({  
    player: String,
    playerName:String,
    playerAvatar:String,
    gamesPlayed:Number,
    gamesWon: Number,
    grabsUsed:Number,
    slapsUsed:Number,
    sneaksUsed:Number
  });

  GrabbitPlayerStats = mongoose.model('GrabbitPlayerStats', grabbitPlayerStatsSchema);

}

export default GrabbitPlayerStats;
