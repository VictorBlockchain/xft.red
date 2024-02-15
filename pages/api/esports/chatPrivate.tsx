import clientPromise from "../../../lib/mongodb";
import Profile from "../schema/profile"
import ChatPrivate from "../schema/chatPrivate"

export default async function handler(req:any, res:any) {
    if (req.method === 'GET') {
        const sender = req.query.sender;
        const receiver = req.query.receiver;
    
      try {
        // Retrieve messages from MongoDB
        const messages = await ChatPrivate
        .find({
            $or: [
            { to: receiver, from: sender },
            { to: sender, from: receiver },
            ],
        })
        .sort('-time')
        .limit(50);
        res.status(200).json(messages);
      
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else if (req.method === 'POST') {
      try {
        const { message, accountFrom, accountTo } = req.body;
        // console.log(from,to)
        let time = new Date();
        const userFrom:any = await Profile.findOne({account:accountFrom.toLowerCase()});
        // console.log(userFrom)
        const userTo:any = await Profile.findOne({account:accountTo.toLowerCase()});
        let moderatorFrom = false
        let moderatorTo = false
        if(userFrom.moderator){
            moderatorFrom = true
        }
        if(userTo.moderator){
            moderatorTo = true
        }    
        
        const chatMessage = new ChatPrivate({to:accountTo, from:accountFrom, fromName:userFrom.name2, toName:userTo.name2, message:message, time:time.getTime(),moderatorTo:moderatorTo,moderatorFrom:moderatorFrom,avatarTo:userTo.avatar,avatarFrom:userFrom.avatar });
        await chatMessage.save();
        // Chat.collection.drop();
        
        res.status(201).json({success:true, message: 'Message saved successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }


