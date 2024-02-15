// profiles.js

import clientPromise from "../../lib/mongodb";
import Grabbit from './schema/grabbit';
import GrabbitPlayers from "./schema/grabbitPlayers";
import Profile from "./schema/profile"

export default async (req:any, res:any) => {
    try {
        const { play, title, type, story, image, nft2play, nft2playcontract, nft2playlabel,token2playcontract, token2playbalance,ahpreferralcount,grabs,slaps,sneaks,playersMax,playersMin,prize,prizeValue,prizeNftea,prizecontract,lat,long, account } = req.body;
        const updateFields:any = {};
        
        let game:any = await Grabbit.findOne({ _id:play});
        if (title && title != game.title) {
            updateFields.title = title;
          }
          if (type && type != game.type) {
            updateFields.type = type;
          }
          if (story && story != game.story) {
            updateFields.story = story;
          }
          if (image && image != game.image) {
            updateFields.image = image;
          }
          if (nft2play && nft2play != game.nft2play) {
            updateFields.nft2play = nft2play;
          }
          if (nft2playcontract && nft2playcontract != game.nft2PlayContract) {
            updateFields.nft2PlayContract = nft2playcontract;
          }
          if (nft2playlabel && nft2playlabel != game.nft2PlayLabel) {
            updateFields.nft2PlayLabel = nft2playlabel;
          }
          if (token2playcontract && token2playcontract != game.token2PlayContract) {
            updateFields.token2PlayContract = token2playcontract;
          }
          if (token2playbalance && token2playbalance != game.token2PlayBalance) {
            updateFields.token2PlayBalance = token2playbalance;
          }
          if (ahpreferralcount && ahpreferralcount != game.ahpReferralCount) {
            updateFields.ahpReferralCount = ahpreferralcount;
          }
          if (grabs && grabs != game.grabs) {
            updateFields.grabs = grabs;
          }
          if (slaps && slaps != game.slaps) {
            updateFields.slaps = slaps;
          }
          if (sneaks && sneaks != game.sneaks) {
            updateFields.sneaks = sneaks;
          }
          if (playersMax && playersMax != game.playersMax) {
            updateFields.playersMax = playersMax;
          }
          if (playersMin && playersMin != game.playersMin) {
            updateFields.playersMin = playersMin;
          }
          if (prize && prize != game.prize) {
            updateFields.prize = prize;
          }
          if (prizeValue && prizeValue != game.prizeValue) {
            updateFields.prizeValue = prizeValue;
          }
          if (prizeNftea && prizeNftea != game.prizeNftea) {
            updateFields.prizeNftea = prizeNftea;
          }
          if (prizecontract && prizecontract != game.prizecontract) {
            updateFields.prizecontract = prizecontract;
          }
          
          const result = await Grabbit.findOneAndUpdate(
            { _id:play },
            { $set: updateFields },
            { new: true, upsert: true }
          );
        
        res.json({msg:'game updated'});
        
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
