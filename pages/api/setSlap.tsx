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
            if(player.slaps>0){

                if((game.end > currentTime.getTime()) || (game.end==0)){
                    
                    if(game.slapper=='0'){
                        ///process grab
                        game.slapper = account
                        player.slaps -=1;
                        player.slapsUsed +=1
                        await game.save();
                        await player.save();
                        msg = {msg:'slap pending'}
                    
                    }else{
                        ///theres a slap pending
                        msg = {msg:'slap pending'}
                    
                    }
                
                }else{
                    //game is over
                    msg = {msg:'game over!'}
                
                }
            
            }else{
                /// player is out of grabs
                msg = {msg:'out of slaps'}
            
            
            }
        }
        
        res.json(msg);
        
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
