// profiles.js

import clientPromise from "../../lib/mongodb";
import Grabbit from './schema/grabbit';
import GrabbitPlayers from "./schema/grabbitPlayers";
import Profile from "./schema/profile"

export default async (req:any, res:any) => {
    try {
        const { play, account, joinnft } = req.body;
        
        let game:any;
        let profile:any;
        let endTime:any;
        let msg:any = {};
        if(account){

            if(play!=0){
                let currentTime = new Date();
                game = await Grabbit.findOne({ _id:play});
                profile = await Profile.findOne({account:account, active:true})
                if(profile){
                
                    if(game.active){
                    
                        let currentTime = new Date();
                        let time = currentTime.getTime();
                        
                        if((game.startPlay == 0 || time < game.startPlay )){
                            let players = game.playersReady + 1;
                            
                            if(players <= game.playersMax){
                                let inGame = await GrabbitPlayers.findOne({player:account, active:true, completed:false})
                                if(!inGame){
                                    let pass = 1;
                                    if(game.type==1 || game.type==2){
                                        const practiceCount = await GrabbitPlayers.countDocuments({ player: account, completed: true, type:3 });
                                        if(practiceCount<3){
                                            pass = 0
                                            msg = {msg:'play at least 3 practice games 1st'}

                                        }
                                    }
                                    if(pass>0){
                                        let expire:any = new Date(currentTime.getTime() + 120 * 1000); 
                                        expire = expire.getTime();
                                        let joinGame = new GrabbitPlayers({player:account,playerName:profile.name2,playerAvatar:profile.avatar,game:play,grabs:game.grabs,slaps:game.slaps,sneaks:game.sneaks,grabsUsed:0,
                                        slapsUsed:0,sneaksUsed:0,joined:currentTime.getTime(),expire:expire,joinNFT:joinnft,winner:false,reload:0,active:true,completed:false,sneakOpen:false, type:game.type})
            
                                        if(players >=game.playersMin && game.startPlay==0){
                                            //start game
                                            let start:any = new Date(currentTime.getTime() + 15 * 1000); 
                                            start = start.getTime();
                                            game.startPlay = start
                
                                        }else{
                                            game.startPlay = 0
                                        }
                                        game.playersReady = players;
                                        await joinGame.save();
                                        await game.save();
                                    
                                        msg = {msg:'you are in'}
                                    }
                                                                
                                }else{
                                    
                                    let currentTime:any = new Date();
                                    currentTime = currentTime.getTime();
                                    let expire:any = inGame.expire;
                                    if(currentTime>expire && game.startPlay==0){
                                        inGame.active = false;
                                        await inGame.save()
                                        const playerCount = await GrabbitPlayers.countDocuments({ game: play, active: true, completed: false });
                                        game.playersReady = playerCount;
                                        await game.save()
                                        msg = {msg:'your seat expired, trying joining again'}
                                    
                                    }else{
                                        msg = {msg:'you are already in a game'}
        
                                    }
        
                                }
                            }else{
                              
                                msg = {msg:'game is full'}
                            }
                        
                        }else{
                            
                            msg = {msg:'game already started'}
                        
                        }
                    }else{
                        msg = {msg:'game over'}
                    }
                
                }else{
                        msg = {msg:'create your profile 1st'}
                }
            }

        }else{
                    msg = {msg:'connect your wallet to play'}
        }
        
        
        res.json(msg);
        
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
