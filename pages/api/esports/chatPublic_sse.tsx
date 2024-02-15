import Chat from "../schema/chat"
const sse = require("../sse/index");

export default async (req:any, res:any) => {
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // Send a comment to keep the connection open
  res.write(':ok\n\n');

  // Function to send updates to the client
  const sendUpdate = async () => {
    try {
      const messages:any = await Chat.find().sort('-time').limit(50); // Adjust the limit as needed
      res.write(`data: ${JSON.stringify(messages)}\n\n`);
      res.flush()
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  // Send initial set of messages when a client connects
  await sendUpdate();
  
  // Handle disconnect
  res.on('close', () => {
    // Clean up or handle disconnection
  });

  // Listen for changes in the database and send updates
  const changeStream = Chat.watch();
  changeStream.on('change', async () => {
    await sendUpdate();
  });
};
