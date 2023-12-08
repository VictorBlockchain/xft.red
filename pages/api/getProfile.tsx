// profiles.js

import clientPromise from "../../lib/mongodb";

export default async (req:any, res:any) => {

    try {
        const client = await clientPromise;
        const db = client.db("nftea");
        const { account } = req.query;
        let profile:any = await db.collection("profiles").findOne({ account: account });
        // console.log(profile)
        if(!profile){
            profile = {
                account: 'n/a',
                name: 'n/a',
                email: 'n/a',
                artistName: 'n/a',
                story: 'n/a',
                twitter: 'n/a',
                profilePic:"/assets/avatar/1.jpeg",
                pfp: '0',
                cover: ''
            }
        }
        res.json(profile);
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
