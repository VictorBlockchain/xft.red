// profiles.js

import clientPromise from "../../lib/mongodb";

export default async (req:any, res:any) => {

    try {
        const client = await clientPromise;
        const db = client.db("nftea");
        const { method, query } = req;
        const { account, id } = query;

        if (method === 'GET') {
            if (account) {
            // Fetch all blogs for a user
            const blogs = await db.collection('blogs').find({ account }).toArray();
            res.status(200).json(blogs);
            } else if (id) {
            // Fetch a single blog by id
            const blog = await db.collection('blogs').findOne({ _id: id });
            res.status(200).json(blog);
            } else {
            res.status(400).json({ message: 'Invalid query parameters' });
            }
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
