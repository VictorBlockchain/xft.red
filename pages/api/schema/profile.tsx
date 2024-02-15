const mongoose = require('mongoose');
const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl);
let Profile:any;
try {
  Profile = mongoose.model('Profile');
} catch (error) {

  const profileSchema = new mongoose.Schema({
    active:Boolean,
    email:String,
    phone:String,
    account:String,
    name:String,
    name2:String,
    avatar:String,
    lastLogIn:Number,
    twitter:String,
    tiktok:String,
    story:String,
    cover:String,
    admin:Boolean,
    moderator:Boolean,
    verifiedEmail:Boolean,
    verifiedTwitter:Boolean,
    verifiedTikTok:Boolean,
    verifiedPhone:Boolean,
    ahpReferrals:Number,
    location: {
      type: { type: String, enum: ['Point']},
      coordinates: { type: [Number]},
    },
  });
  Profile = mongoose.model('Profile', profileSchema);
}


export default Profile;
