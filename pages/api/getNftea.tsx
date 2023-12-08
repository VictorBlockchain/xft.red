// profiles.js

import clientPromise from "../../lib/mongodb";

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const db = client.db("nftea");
        const { nftea } = req.body;

        const nft = await db.collection("nfteas").findOne({ nftea: nftea });

        res.json(nft);
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
