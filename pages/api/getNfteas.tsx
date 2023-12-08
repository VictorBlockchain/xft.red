import clientPromise from "../../lib/mongodb";

export default async (req:any, res:any) => {
    try {
        const client = await clientPromise;
        const db = client.db("nftea");
        const { contract } = req.body;

        const nfts = await db.collection("nfteas").find({ contract: contract }).toArray();
        res.json(nfts);
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
