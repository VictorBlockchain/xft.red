// profiles.js

import clientPromise from "../../../lib/mongodb";
import Token from "../schema/tokens"

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const db = client.db("nftea");
        const { query } = req.body;
        console.log(query)
        const names = await Token.find({
            $or: [
              { name: { $regex: `^${query}`, $options: 'i' } },
              { ticker: { $regex: `^${query}`, $options: 'i' } }
            ]
          })
        .select('name address')
        .limit(10); // Limit the number of results
  
      res.json(names);
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
