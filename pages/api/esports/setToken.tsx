import clientPromise from "../../../lib/mongodb";
import Profile from "../schema/profile"
import Token from "../schema/tokens"
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
        const {address,name,ticker,decimals,website,twitter } = req.body;
        const token = await Token.findOne({address:address})
        let status = false
        let msg = 'worked'
        // Token.collection.drop();
        
        if(!token){
            let token_new = new Token({address:address,name:name,ticker:ticker,decimals:decimals,website:website,twitter:twitter})
            token_new.save()
            status = true
        }else{
         msg = 'token already added'
        }
        
        res.json({success:status, msg:msg, data:token});
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
