import clientPromise from "../../../lib/mongodb";
import Profile from "../schema/profile"
import Chat from "../schema/chat"

export default async function handler(req:any, res:any) {
    if (req.method === 'GET') {
      try {
        // Retrieve messages from MongoDB
        const messages = await Chat.find().sort('-time').limit(50);
        res.status(200).json(messages);
      
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else if (req.method === 'POST') {
      try {
        const { message, account } = req.body;
  
        let time = new Date();
        const user:any = await Profile.findOne({account:account.toLowerCase()});
        let moderator = false
        if(user.moderator){
            moderator = true
        }
        const chatMessage = new Chat({ name:user.name2, account:account, message:message, time:time.getTime(),moderator:moderator,avatar:user.avatar });
        await chatMessage.save();
        // Chat.collection.drop();
        
        res.status(201).json({ message: 'Message saved successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }


