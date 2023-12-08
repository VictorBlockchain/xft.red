// profiles.js

import clientPromise from "../../lib/mongodb";

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const db = client.db("nftea");
        const { label,operator,license,expire,role,wlimit,wdelay,wfreq} = req.body;

        const post = await db.collection("operators").insertOne({
            label,
            operator,
            license,
            wlimit,
            wdelay,
            wfreq,
            expire,
            role
        });

        res.json(post);
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
