// profiles.js

import clientPromise from "../../lib/mongodb";
import Grabbit from './schema/grabbit';
import GrabbitPlayers from "./schema/grabbitPlayers";
import Profile from "./schema/profile"

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const { title, type, story, image, nft2play, nft2playcontract, nft2playlabel,token2playcontract, token2playbalance,ahpreferralcount,grabs,slaps,sneaks,playersMax,playersMin,prize,prizeValue,prizeNftea,prizecontract,lat,long, account } = req.body;
    
        let game_new = new Grabbit({slapper:'0', active:true, completed:false,canGrab:true, nft2Play:nft2play, nft2PlayContract: nft2playcontract, nft2PlayLabel:nft2playlabel, token2PlayContract:token2playcontract, token2PlayBalance:token2playbalance,ahpReferralCount:ahpreferralcount, creator: account, grabs:grabs, slaps:slaps, sneaks: sneaks, winner:"0x...", winnerName:"no one yet", winnerAvatar:"/assets/avatar/1.jpeg", start:0,startPlay:0,end:0,players:[],playersMax:playersMax,playersMin:playersMin,playersReady:0, prize:prize,prizeValue:prizeValue,prizeNftea:prizeNftea,prizeContract:prizecontract,prizePaid:false,prizeTxid:null,  location: {
            type: 'Point',
            coordinates: [lat, long],
          }, practice:false, type:type, title:title,image:image, story:story,grabTime:0,lastGrabber:'0x..',lastGrabTime:0});
        await game_new.save();
        
        res.json({msg:'game created'});
        
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
