// profiles.js

import clientPromise from "../../lib/mongodb";

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const db = client.db("nftea");
        const { nftea,ipfs,contract} = req.body;

        const post = await db.collection("nfteas").insertOne({
            nftea,
            contract,
            ipfs
        });

        res.json(post);
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
