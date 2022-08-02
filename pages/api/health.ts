// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../api/external/mongodb";
type Response = {
    mongodb: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    const [mongodb] = await Promise.all([
        (async (): Promise<string> => {
            const { db } = await connectToDatabase();
            const doc = await db.stats();
            return doc && Object.keys(doc).length != 0 ? "OK" : "NOT OK";
        })(),
    ]);
    res.status(200).json({ mongodb });
}
