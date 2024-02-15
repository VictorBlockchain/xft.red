// profiles.js

import clientPromise from "../../lib/mongodb";
import Grabbit from './schema/grabbit';
import GrabbitPlayers from "./schema/grabbitPlayers";

export default async (req:any, res:any) => {
    try {
        // const client = await clientPromise;
        // const db = client.db("nftea");
        const { play } = req.body;
        
        let game:any;
        let players:any;
        if (play != 0) {
            let currentTime = new Date();
            game = await Grabbit.findOne({ _id: play});
            players = await GrabbitPlayers.find({ game: play });   
            game.players = players;       
            if (game.end > currentTime.getTime()) {
              let timeLeft = game.end - currentTime.getTime();
              // Convert milliseconds to seconds
              timeLeft = Math.ceil(timeLeft / 1000);
              game.timeLeft = timeLeft

            } else {
              
              game.active = false;
              if(game.active){
                await game.save();
              }
              game.timeLeft = 0;
            
            }
        }
        
        res.json(game);
        
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
