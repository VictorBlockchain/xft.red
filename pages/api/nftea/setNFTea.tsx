// profiles.js

import clientPromise from "../../../lib/mongodb";
import NFTea from "../schema/nftea"

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const { id,ipfs,image} = req.body;

        const post = new NFTea({
            id:id,
            ipfs:ipfs,
            image:image
        })
        post.save();
        
        res.json(post);
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
