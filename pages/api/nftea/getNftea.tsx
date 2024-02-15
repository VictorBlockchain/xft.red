// profiles.js

import clientPromise from "../../../lib/mongodb";
import NFTea from "../schema/nftea"

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const db = client.db("nftea");
        const { id } = req.query;
        
        const nft = await NFTea.find({id:id})
  
      res.json(nft);
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
