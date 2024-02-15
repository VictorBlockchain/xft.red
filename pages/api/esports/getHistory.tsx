// profiles.js

import clientPromise from "../../../lib/mongodb";
import Profile from "../schema/profile"
import Esports from "../schema/esports"

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const db = client.db("nftea");
        let { player, gameId } = req.query;
        // console.log(player, gameId)
        let challenge:any;
        player = player.toLowerCase()
        if(gameId==0){
            const pipeline = [
                {
                  $group: {
                    _id: { gameId: "$gameId" },
                    count: { $sum: 1 },
                    ids: { $push: "$_id" }
                  }
                },
                {
                  $match: {
                    count: { $gt: 1 }
                  }
                }
              ];
              
              const duplicates = await Esports.aggregate(pipeline);
              
              // Removing duplicate documents
              duplicates.forEach(async (duplicate:any) => {
                // Keep one instance, remove the others
                const [keep, ...remove] = duplicate.ids;
                await Esports.deleteMany({ _id: { $in: remove } });
              });

            challenge = await Esports.find({
                $or: [
                    { player1: player, completed: true },
                    { player2: player, completed: true }
                ]
            });
        
        }else{
            challenge = await Esports.findOne({gameId:gameId})
        }
        // Esports.collection.drop();

        res.json(challenge);
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
