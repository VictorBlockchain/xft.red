// profiles.js

import clientPromise from "../../lib/mongodb";
import Grabbit from './schema/grabbit';
import GrabbitPlayers from "./schema/grabbitPlayers";

export default async (req:any, res:any) => {
    try {
        const { play, account } = req.body;
        
        let game:any;
        let player:any;
        let endTime:any;
        let msg:any = {};
        
        if(play!=0){
            let currentTime = new Date();
            game = await Grabbit.findOne({ _id:play});
            player = await GrabbitPlayers.findOne({game:play, player:account})
            if(player.sneaks>0){

                if((game.end > currentTime.getTime()) || (game.end==0)){
                    
                    if(!player.sneakOpen){
                        ///process grab
                        player.sneakOpen = true
                        player.sneaks -=1;
                        player.sneaksUsed +=1
                        await player.save();
                        msg = {msg:'sneak ready'}
                    
                    }else{
                        ///theres a slap pending
                        msg = {msg:'sneak ready'}
                    
                    }
                
                }else{
                    //game is over
                    msg = {msg:'game over!'}
                
                }
            
            }else{
                /// player is out of sneaks
                msg = {msg:'out of sneaks'}
            
            
            }
        }
        
        res.json(msg);
        
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
