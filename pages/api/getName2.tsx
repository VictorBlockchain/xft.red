// profiles.js

import clientPromise from "../../lib/mongodb";
import Profile from "./schema/profile"

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const { query } = req.body;
        // console.log(query)
        const names = await Profile.find({ name2: { $regex: `^${query}`, $options: 'i' } })
        .select('name2 account')
        .limit(10); // Limit the number of results
  
      res.json(names);
    
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
