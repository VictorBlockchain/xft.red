// profiles.js

import clientPromise from "../../lib/mongodb";
import Profile from "./schema/profile"

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const db = client.db("nftea");
        // const { account } = req.query;
        const userCount = await Profile.countDocuments({ active: true });
        const users = await Profile.find({active:true})
        
        res.json({count:userCount, users:users});
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
