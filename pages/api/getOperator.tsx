// profiles.js

import clientPromise from "../../lib/mongodb";

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const db = client.db("nftea");
        const { label } = req.body;

        const operators = await db.collection("operator").find({ label: label }).toArray();

        res.json(operators);
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
