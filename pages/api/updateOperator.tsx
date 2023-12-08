// profiles.js

import clientPromise from "../../lib/mongodb";

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const db = client.db("nftea");
        const { label, operator, license, expire, role, wlimit, wdelay, wfreq } = req.body;

        const filter = { label: label, operator: operator };
        const update = {
          $set: {
            license,
            wlimit,
            wdelay,
            wfreq,
            expire,
            role
          }
        };
        const result = await db.collection("operators").updateOne(filter, update);
        res.json(result);
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
