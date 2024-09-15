// profiles.js

import clientPromise from "../../lib/mongodb";
import Profile from "./schema/profile"

export default async (req:any, res:any) => {

    try {
        const { account } = req.query;
        let profile:any = await Profile.findOne({ account: account });
        let makeAdmin = "0xc313bc7A6c17D4C0EF7741FaBB5C5b8b0C1ad3Ae"
        if(account == makeAdmin.toLowerCase() && profile && !profile.admin){
            profile.admin = true;
            profile.save()
        }
        
        // console.log(profile)
        if(!profile){
            
            profile = {
                active:true,
                email:'n/a',
                phone:'n/a',
                account:account,
                name:'n/a',
                name2:'n/a',
                avatar:'/assets/avatar/1.jpeg',
                lastLogIn:'n/a',
                twitter:'n/a',
                tiktok:'n/a',
                story:'n/a',
                cover:'n/a',
                admin:false,
            }
        }
        res.json(profile);
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
