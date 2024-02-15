import clientPromise from "../../../lib/mongodb";
import Profile from "../schema/profile"
import Esports from "../schema/esports"
const winston = require('winston');

// Define your logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logfile.log' }),
  ],
});

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const db = client.db("nftea");
        const {gameid, score1,score2,scorer } = req.body;
        console.log(gameid, score1,score2,scorer)
        let status = false
        const challenge = await Esports.findOne({gameId:gameid})
        if(challenge){
            let winner:any;
            if(score1>score2){
                winner = challenge.player1
            }else{
                winner = challenge.player2
            }
            challenge.score1 = score1
            challenge.score2 = score2
            challenge.winner = winner
            challenge.scorer = scorer.toLowerCase()
            challenge.save()
            status = true
        }
        
        res.json({success:status});
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
