// profiles.js
import fs from 'fs';
import clientPromise from "../../lib/mongodb";

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const db = client.db("nftea");

        const { nftea, show } = req.body;   

            // Check if account exists
            const existingDisplay = await db.collection("display").findOne({ nftea });

            if (existingDisplay) {
            // Account exists, update the profile
            const updatedFields:any = {};
            updatedFields.show = show;

            if (Object.keys(updatedFields).length > 0) {
              const updatedProfile = await db.collection("display").updateOne(
                { nftea },
                {
                  $set: updatedFields
                }
              );
            // console.log(updatedProfile)
            return res.json(existingDisplay);
            }

            } else {
            // Account does not exist, insert the profile
            const post = await db.collection("display").insertOne({
                nftea,
                show
            });

            return res.json(post);
            }
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
