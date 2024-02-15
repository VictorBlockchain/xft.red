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
        
        let {amount,console,_game,gameId,nftIdPlayer1,nftIdPlayer2,player1,player2,rules,token } = req.body;
        let p1:any;
        let p2:any;
        let name2:any = 'open challenge'
        const challenge = await Esports.findOne({gameId:gameId})
        // logger.info(challenge)
        p1  = await Profile.findOne({account:player1.toLowerCase()})
        if(player2 && player2!=BLANK){
            p2 = await Profile.findOne({account:player2.toLowerCase()})
            name2 = p2.name2
            player2 = player2.toLowerCase()
        }else if (player2==BLANK){
            player2 = BLANK
        }
        let status = false
        if(!challenge){
            
            let date:any = new Date();
            date = date.getTime();
            let game:any = new Esports({gameId:gameId,active:true,completed:false,player1:player1.toLowerCase(),name1:p1.name2,name2:name2,player2:player2,score1:0,score2:0,game:_game,console:console,amount:amount,token:token,player1nft:nftIdPlayer1,player2nft:nftIdPlayer2,rules:rules,winner:null,accepted:false,disputed:false,disputer:null,mediator:null,stream:null,canceled:false,date:date,dateScored:0,scorer:null})  
            await  game.save() 
            status = true
            // Esports.collection.drop();
        
        }else{
            // challenge.player1 = challenge.player1.toLowerCase()
            // challenge.player2 = challenge.player2.toLowerCase()
            // challenge.save()
            // Esports.collection.drop();
        
        }
        
        res.json({success:status});
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
