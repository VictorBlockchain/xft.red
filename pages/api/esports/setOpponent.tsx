import clientPromise from "../../../lib/mongodb";
import Profile from "../schema/profile"
import Esports from "../schema/esports"
const winston = require('winston');
const BLANK:any = '0x0000000000000000000000000000000000000000';

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
        const {gameid, opponent } = req.body;
        console.log(gameid, opponent)
        let status = false;
        let p2:any;
        let name;
        if(opponent && opponent!=BLANK){
            p2 = await Profile.findOne({account:opponent.toLowerCase()})
            name = p2.name2
        }else{
            name = "open challenge"
        }
        const challenge = await Esports.findOne({gameId:gameid})
        if(challenge){
            challenge.player2 = opponent.toLowerCase()
            challenge.name2 = name
            challenge.save()
            status = true
        }
        res.json({success:status});

    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
