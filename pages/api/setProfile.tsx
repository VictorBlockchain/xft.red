// profiles.js
import fs from 'fs';

import clientPromise from "../../lib/mongodb";

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const db = client.db("nftea");
        
        const { account, name, email, artistName, story, twitter, profilePic, pfp, cover } = req.body;   

        const existingProfile = await db.collection("profiles").findOne({ artistName });
        // console.log(existingProfile)

        if (existingProfile && existingProfile.account!=account) {
            // artistName is already taken
            return res.status(400).json({ message: "Artist name is not available." });

        }else{
            // Check if account exists
            const existingAccount = await db.collection("profiles").findOne({ account });
            
            if (existingAccount) {
            // Account exists, update the profile
            const updatedFields:any = {};
  
            if (name && name !== existingAccount.name) {
                updatedFields.name = name;
            }
            if (email && email !== existingAccount.email) {
              updatedFields.email = email;
          }
            if (profilePic && profilePic !== existingAccount.profilePic) {
                updatedFields.profilePic = profilePic;
              }
              
            if (artistName && artistName !== existingAccount.artistName) {
              updatedFields.artistName = artistName;
            }

              if (story && story !== existingAccount.story) {
                updatedFields.story = story;
              }
              if (twitter && twitter !== existingAccount.twitter) {
                updatedFields.twitter = twitter;
              }
              if (artistName && artistName !== existingAccount.artistName) {
                updatedFields.artistName = artistName;
              }
              if (pfp && pfp !== existingAccount.pfp) {
                updatedFields.pfp = pfp;
              }
            if (Object.keys(updatedFields).length > 0) {
              const updatedProfile = await db.collection("profiles").updateOne(
                { account },
                {
                  $set: updatedFields
                }
              );
            // console.log(updatedProfile)
            return res.json(existingAccount);
            }

            } else {
            // Account does not exist, insert the profile
            const post = await db.collection("profiles").insertOne({
                account,
                name,
                email,
                artistName,
                story,
                twitter,
                profilePic,
                pfp,
                cover
            });

            return res.json(post);
            }
        }
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
