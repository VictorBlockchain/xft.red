import ChatPrivate from "../schema/chatPrivate"
const sse = require("../sse/index");

export default async (req:any, res:any) => {
    const to = req.query.to;
  console.log(to)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // Send a comment to keep the connection open
  res.write(':ok\n\n');
  
  // Function to send updates to the client
      res.write(to);
      res.flush()
  
  // Handle disconnect
  res.on('close', () => {
    // Clean up or handle disconnection
  });

};
