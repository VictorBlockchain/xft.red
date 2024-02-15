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
        const {gameid,txid} = req.body;
        let status = false
        const challenge = await Esports.findOne({gameId:gameid})
        if(challenge){

            challenge.active = false
            challenge.completed = true
            challenge.dateScored = new Date().getTime()
            challenge.txid = txid
            challenge.save()
            status = true
        }
        
        res.json({success:status});
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
