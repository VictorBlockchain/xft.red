import clientPromise from "../../lib/mongodb";

export default async function handler(req:any, res:any) {
  if (req.method === 'POST') {
    const client = await clientPromise;
    const db = client.db("nftea");
    
    // const { db } = await connectToDatabase();
    const { account,content,date } = req.body;
    
    // Store the content in MongoDB
    const result = await db.collection('blogs').insertOne({
      account,
      content,
      date: new Date(date), 
    });

    res.status(201).json({ success: true, id: result.insertedId });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
