import Chat from "../schema/chat";
import Grabbit from "../schema/grabbit";
import GrabbitPlayers from "../schema/grabbitPlayers";
import Profile from "../schema/profile"

export default async (req: any, res: any) => {
  const { play } = req.query;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering','no')
  // Send a comment to keep the connection open
  res.write(':ok\n\n');
  console.log("workings")
  // Function to send updates to the client
  const sendUpdate = async () => {
    try {
      
      let currentTime = new Date().getTime();
      let timer:any;
      let game:any = [];
      let players:any;
      
      if(play!=0){
        console.log("getting play")
        game = await Grabbit.findOne({ _id: play });
        if(game.active){
          players = await GrabbitPlayers.find({ game: play, active:true, completed:false }); 
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
                game.timer = Math.ceil(timer / 1000);

            }else{

                if(game.start==0){
                    game.start = 1
                    await game.save()
                }
                if(game.end==0){
                    
                    game.timer = "click grab"
                
                }else{

                      timer = game.end - currentTime;
                      game.timer = Math.ceil(timer / 1000);
                    
                    if(game.timer<=0){
                      
                      if(!game.completed){
                        game.active = false
                        game.completed =true
                        game.canGrab = false
                        // if(game.grabTime>game.end){
                        //   let profile = await Profile.findOne({account:game.lastGrabber, active:true})

                        //   game.winner = game.lastGrabber
                        //   game.winnerName = profile.name2
                        //   game.winnerAvatar = profile.avatar
                        
                        // }
                        for (let i = 0; i < players.length; i++) {
                            const element = players[i];
                            element.completed = true
                            element.active = false
                            await players[i].save()
                        }
                      }
                      
                      game.timer = 'game over'      
                      await game.save()              
                    }
                }
            
            }
        }
        }else{
          players = await GrabbitPlayers.find({game:play, active:false, completed:true})
          game.timer = 'game over'
        }
        game.playersReady = players.length
        if(players.length>0){
          game.players = players;
        }
      }else{
        console.log("creating grabbit game")
        const practiceCount = await Grabbit.countDocuments({ practice: true, active: true, startPlay: 0 });
        if(practiceCount<4){
            //create one
            const rand = Math.floor(Math.random() * 4) + 1;
            let grabs = Math.floor(Math.random() * 25) + 1;
            if(grabs<10){
                grabs = 10
            }
            const slaps = Math.floor(Math.random() * 25) + 1;
            const sneaks = Math.floor(Math.random() * 25) + 1;
            let practice_new = new Grabbit({
                active:true,
                completed:false,
                canGrab:true,
                nft2Play: 0,
                nft2PlayContract:null,
                nft2PlayLabel:0,
                token2PlayContract:null,
                token2PlayBalance:0,
                ahpReferralCount:0,
                creator: 'nftea',
                grabs: grabs,
                slaps: slaps,
                sneaks: sneaks,
                winner:'0x..',
                winnerName:'no one yet',
                winnerAvatar:"/assets/avatar/1.jpeg",
                start:0,
                startPlay:0,
                end:0,
                players:[],
                playersMax:25,
                playersMin:2,
                playersReady:0,
                prize:'null',
                prizeValue:0,
                prizeType:3,
                prizeNftea:0,
                prizeContract:null,
                prizePaid:false,
                prizeTxid:null,
                practice:true,
                title:'Practice',
                image:'/grabbit/'+rand+'.jpeg',
                slapper:'0',
                story:'Practice, Practice, Practice... grab a friend and work on your skills. 2 players needed to start, max 25 players in a game. The time you spend practicing will show when it\'s time to win nftea\'s and crypto',
                type:3,
                grabTime:0,
                lastGrabber:'0x..',
                lastGrabTime:0,
                location: {
                    type: 'Point',
                    coordinates: [0, 0],
                  },
            })
            await practice_new.save();
                
                // await Grabbit.deleteMany({});
                // await GrabbitPlayers.deleteMany({});
                // Grabbit.collection.drop();
          
          }else{
          
                // await Grabbit.deleteMany({});
                // await GrabbitPlayers.deleteMany({});
                // Grabbit.collection.drop();
          
          }
          game = await Grabbit.find({ active:true});
      }
      
      // console.log(data)
      res.write(`data: ${JSON.stringify(game)}\n\n`);
      res.flush();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  // Send initial set of messages when a client connects
  await sendUpdate();

  // Handle disconnect
  // res.on('close', () => {
  //   // Clean up or handle disconnection
  // });
  
  // Set up an interval to send updates every second
  const intervalId = setInterval(async () => {
    if(play!=0){
      const game = await Grabbit.findOne({ _id: play });
      if(!game.completed && game.active){
        await sendUpdate();
      }
    }
  }, 1000);
  
  // Listen for changes in the database and send updates
  const changeStream = Grabbit.watch();
  changeStream.on('change', async () => {
    const currentTime = new Date().getTime();
    if(play!=0){
      const game = await Grabbit.findOne({ _id: play });
      let END = game.end;
      if(END>0 && END<=currentTime){
        game.canGrab = false;
        game.save()
      }
      await sendUpdate();
    }
  });
  
  // Stop sending updates when the connection is closed
  res.on('close', () => {
    clearInterval(intervalId);
  });
};
