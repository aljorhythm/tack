import { NextApiResponse } from "next/types";
import nc from "next-connect";
import attachUserToRequest, { TackApiRequest } from "../../../request";
import { findUserById } from "../../user/persistence";
import { UserClass } from "../../user/domain";

const handler = nc<TackApiRequest, NextApiResponse>()
    .use(attachUserToRequest(findUserById, UserClass))
    .get(async (req, res) => {
        const { id: tackId } = req.query;
        const text = await req.user!.getTackText(tackId as string);
        res.send({ text });
    });

export default handler;
