// profiles.js

import clientPromise from "../../lib/mongodb";
import Grabbit from './schema/grabbit';
import GrabbitPlayers from "./schema/grabbitPlayers";
import Profile from "./schema/profile"

export default async (req:any, res:any) => {
    try {
        const { play, account } = req.body;
        const startTime = performance.now(); 
        let game:any;
        let player:any;
        let profile:any;
        let endTime:any;
        let msg:any = {};
        
        if(play!=0){
            let currentTime = new Date();
            game = await Grabbit.findOne({ _id:play});
            player = await GrabbitPlayers.findOne({game:play, player:account})
            profile = await Profile.findOne({account:account, active:true})
            let END = game.end;
            if(game.canGrab){
                if(player.grabs>0){
                    // let timer = game.end - currentTime.getTime();
                    // timer = Math.ceil(timer / 1000);
                    
                    if((END>=currentTime.getTime()) || END==0){
                        
                        if(game.slapper==account || game.slapper=='0'){
                            //prevent double grab
                            let pass = 1;
                            if(game.winner==account && !player.sneakOpen){
                                msg = {msg: 'double grab prevented'}
                                pass = 0;
                            }
                            ///process grab
                            if(pass>0){
                                game.winner = account
                                game.winnerName = profile.name2
                                game.winnerAvatar = profile.avatar
                                game.lastGrabber = game.winner
                                game.lastGrabTime = game.grabTime
                                game.grabTime = new Date().getTime()
                                if(player.sneakOpen){
                                    //add 3 seconds
                                    endTime = new Date(currentTime.getTime() + 3 * 1000); 
                                    game.end = endTime.getTime();
                                    player.sneakOpen = false;
                                    
                                }else{
                                    //add 10 seconds
                                    endTime = new Date(currentTime.getTime() + 10 * 1000); 
                                    game.end = endTime.getTime();
                                
                                }
                                if((END>currentTime.getTime()) || END==0){
                                    player.grabs -=1;
                                    player.grabsUsed +=1
                                    await game.save();
                                    await player.save();
                                    msg = {msg:'grabbed'}    
                                }else{
                                    msg = {msg:'game over bro!'}
                                }
                            }
                        
                        }else{
                            ///player is slapped by another player
                            game.slapper = '0'
                            await game.save();
                            msg = {msg:'you were slapped'}
                        
                        }
                    
                    }else{
                        //game is over
                        game.canGrab = false;
                        await game.save();
                        msg = {msg:'game over!'}
                    
                    }
                
                }else{
                    /// player is out of grabs
                    msg = {msg:'out of grabs'}
                
                
                }            
            }else{
                msg = {msg:'game over'}
 
            }
        
        }
        const endTimez = performance.now(); // Record the end time
        const executionTime = endTimez - startTime;
        console.log(`Execution time: ${executionTime} milliseconds`);

        res.json(msg);
        
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
