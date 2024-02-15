// profiles.js

import clientPromise from "../../lib/mongodb";
import Grabbit from './schema/grabbit';
import GrabbitPlayers from "./schema/grabbitPlayers";
import Profile from "./schema/profile"

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        let { user, admin } = req.body;
        const updateFields:any = {};
        if(user.toLowerCase()=='0xfe23cc5ad68cd64955a8990599dde1d3679805d2'){
        //     let account:any = await Profile.findOne({ account:user.toLowerCase()});
        //     updateFields.admin = false;
        //     updateFields.avatar = "/assets/images/avatar/1.jpeg";
        //     updateFields.email = 'emenexchange@gmail.com';
        //     updateFields.name = 'Njoku';
        //     updateFields.name2 = 'Emen';
        //     updateFields.story = 'Nfteas is a Nice product let\'s see what the got';
        //     updateFields.tiktok = 'Emen';
        //     updateFields.twitter = 'ceoementv';
        //     updateFields.active = true
        //     updateFields.account = '0xfe23cc5ad68cd64955a8990599dde1d3679805d2'
            
        //     const result = await Profile.findOneAndUpdate(
        //     { account:user.toLowerCase() },
        //     { $set: updateFields },
        //     { new: true, upsert: true }
        //   );
        }
        let account:any = await Profile.findOne({ account:user.toLowerCase()});
        if (admin && admin != user.admin) {
            updateFields.admin = admin;
          }
                  
          const result = await Profile.findOneAndUpdate(
            { account:user.toLowerCase() },
            { $set: updateFields },
            { new: true, upsert: true }
          );
        
        res.json({msg:'admin updated'});
        
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
