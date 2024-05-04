// profiles.js
import fs from 'fs';

import clientPromise from "../../lib/mongodb";
import Profile from "./schema/profile"

export default async (req:any, res:any) => {
    try {
        // const client = await clientPromise;
        // const db = client.db("nftea");
        let { email,phone,account,name,name2,avatar,twitter,tiktok,story,cover,admin } = req.body;   
        let msg:any = {};

        let exists = await Profile.findOne({ name2:name2 });
        if(exists && exists.account!=account){
          msg = {msg: 'user name taken'}
        }else{
            
          exists = await Profile.findOne({ email:email });
          if(exists && exists.account!=account){
            msg = {msg: 'email taken'}
          }else{

            exists = await Profile.findOne({ twitter:twitter });
            if(exists && exists.account!=account){
              msg = {msg: 'twitter taken'}
            }else{

              exists = await Profile.findOne({ tiktok:tiktok });
              if(exists && exists.account!=account){
                msg = {msg: 'tiktok taken'}

              }else{
                  
                exists = await Profile.findOne({ account:account });
                if(exists){
                  if(account = "0x4B4B043Ca701354B27660e80202842A88Fd9b27D" || "0x8A53b99BEf987B50B7E3E44657636114cd30C956"){
                    admin = 1;
                  }          
                  ///update fields
                  if(email!=""){
                    exists.email = email
                  }
                  if(phone!=""){
                    exists.phone = phone
                  }
                  if(name!=""){
                    exists.name = name
                  }
                  if(name2!=""){
                    exists.name2 = name2
                  }
                  if(avatar!=""){
                    exists.avatar = avatar
                  }
                  if(twitter!=""){
                    exists.twitter = twitter
                  }
                  if(tiktok!=""){
                    exists.tiktok = tiktok
                  }
                  if(story!=""){
                    exists.story = story
                  }
                  if(cover!=""){
                    exists.cover = cover
                  }
                  if(admin!=""){
                    exists.admin = admin
                  }
                  exists.active = true
                  await exists.save()
                  msg = {msg: 'profile updated'}

                }else{
                  //create new
                  const post = new Profile({
                      account:account,
                      name:name,
                      email:email,
                      name2:name2,
                      story:story,
                      twitter:twitter,
                      avatar:avatar,
                      tiktok:tiktok,
                      cover:cover,
                      phone:phone,
                      active:true,
                      verifiedEmail:false,
                      verifiedTwitter:false,
                      verifiedTiktok:false,
                      verifiedPhone:false,
                      ahpReferrals:0,
                      admin:0
                  });
                  await post.save();
                  msg = {msg: 'profile created'}
                }
              }
            }
          }
        }
        
        res.json(msg);

    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
