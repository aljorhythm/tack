import { NextApiResponse } from "next/types";
import attachUserToRequest, { TackApiRequest } from "../../../request";
import { UserClass } from "../domain";
import { findUserById } from "../persistence";
import nc from "next-connect";

const handler = nc<TackApiRequest, NextApiResponse>()
    .use(attachUserToRequest(findUserById, UserClass))
    .patch(async (req, res) => {
        const { id: tackId } = req.query;
        const { tagsString } = req.body;
        const result = await req.user!.editTags(tackId as string, tagsString as string);
        res.send(result);
    });

export default handler;
