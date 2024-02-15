// profiles.js

import clientPromise from "../../lib/mongodb";
import mongoose from 'mongoose';
import Grabbit from './schema/grabbit';
import GrabbitPlayers from "./schema/grabbitPlayers";
import Profile from "./schema/profile"

export default async (req:any, res:any) => {
    try {
        // const client = await clientPromise;
        // const db = client.db("nftea");
        const { play } = req.body;
        
        let game:any = [];
        let practice:any
        let players:any;
        let timer:any = 0;
        
        if(play!=0){
            
            game = await Grabbit.findOne({ _id:play});
            if(game.active){
                players = await GrabbitPlayers.find({game:play, active:true, completed:false})
                if(players.length < game.playersMin){
                    let currentTime:any = new Date();
                        currentTime = currentTime.getTime()
                    
                    for (let i = 0; i < players.length; i++) {
                        const element = players[i];
                        let expire = element.expire;
                        if(currentTime>expire){
                            element.active = false
                            await players[i].save()
                        
                        }
                    }
                    game.startPlay = 0;
                    await game.save()
                }else{
                    // start game if needed
                    
                    if(players.length >= game.playersMin && game.startPlay<1){
                        let currentTime = new Date();
                        let start:any = new Date(currentTime.getTime() + 15 * 1000); 
                        start = start.getTime();
                        game.startPlay = start
                        game.playersReady = players.length
                        await game.save()
    
                    }
                    //run timer
                    let currentTime:any = new Date();
                    currentTime = currentTime.getTime()
                    if(currentTime < game.startPlay){
                        timer = game.startPlay - currentTime;
                        timer = Math.ceil(timer / 1000);
                    }else{
                        if(game.start==0){
                            game.start = 1
                            await game.save()
                        }
                        if(game.end==0){
                            
                            timer = "click grab"
    
                        }else{
                            
                            if(currentTime < game.end ){
                                
                                timer = game.end - currentTime;
                                timer = Math.ceil(timer / 1000);
                            
                            }else{
                                
                                if(currentTime == game.end){
                                    
                                    timer = 'last chance..'
                                
                                }else if(currentTime>game.end){
    
                                        game.active = false
                                        await game.save()
                                        for (let i = 0; i < players.length; i++) {
                                            const element = players[i];
                                            element.completed = true
                                            element.active = false
                                            await players[i].save()
                                        }
                                    timer = 'game over'
                                
                                }
    
    
                            }
                        }
                    
                    }
                }
            
            }else{
                
                players = await GrabbitPlayers.find({game:play, active:false, completed:true})
                timer = 'game over'
            
            }
            
            
            game.playersReady = players.length
            
            if(players.length>0){
                game.players = players;
            }
        
        }else{
            
            // const practiceCount = await Grabbit.countDocuments({ practice: true, active: true, startPlay: 0 });
            // if(practiceCount<4){
                //create one
                // const rand = Math.floor(Math.random() * 4) + 1;
                // let grabs = Math.floor(Math.random() * 25) + 1;
                // if(grabs<10){
                //     grabs = 10
                // }
                // const slaps = Math.floor(Math.random() * 25) + 1;
                // const sneaks = Math.floor(Math.random() * 25) + 1;
                // let practice_new = new Grabbit({
                //     active:true,
                //     nft2Play: 0,
                //     nft2PlayContract:null,
                //     nft2PlayLabel:0,
                //     token2PlayContract:null,
                //     token2PlayBalance:0,
                //     ahpReferralCount:0,
                //     creator: 'nftea',
                //     grabs: grabs,
                //     slaps: slaps,
                //     sneaks: sneaks,
                //     winner:'0x..',
                //     winnerName:'no one yet',
                //     winnerAvatar:"/assets/avatar/1.jpeg",
                //     start:0,
                //     startPlay:0,
                //     end:0,
                //     players:[],
                //     playersMax:25,
                //     playersMin:2,
                //     playersReady:0,
                //     prize:'null',
                //     prizeValue:0,
                //     prizeType:3,
                //     prizeNftea:0,
                //     prizeContract:null,
                //     prizePaid:false,
                //     prizeTxid:null,
                //     practice:true,
                //     title:'Practice',
                //     image:'/grabbit/'+rand+'.jpeg',
                //     slapper:'0',
                //     story:'Practice, Practice, Practice... grab a friend and work on your skills. 2 players needed to start, max 25 players in a game. The time you spend practicing will show when it\'s time to win nftea\'s and crypto',
                //     type:3,
                //     location: {
                //         type: 'Point',
                //         coordinates: [0, 0],
                //       },
                // })
                // await practice_new.save();

                // await Grabbit.deleteMany({});
                // await GrabbitPlayers.deleteMany({});
                // Profile.collection.drop();
                // Grabbit.collection.drop();
            
            // }else{
            //     // await Grabbit.deleteMany({});
            //     // await GrabbitPlayers.deleteMany({});
            //     // Profile.collection.drop();
            //     // Grabbit.collection.drop();
            // }
            // game = await Grabbit.find({ active:true});
        }
        
        res.json({game:game, timer:timer});
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
