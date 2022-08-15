import type { NextApiResponse } from "next";
import nc from "next-connect";

import attachUserToRequest from "../../request";
import { TackApiRequest } from "../../request";
import { UserClass } from "../user/domain";
import { findUserById } from "../user/persistence";

const handler = nc<TackApiRequest, NextApiResponse>()
    .use(attachUserToRequest(findUserById, UserClass))
    .get(async (req, res) => {
        const result = await req.user!.getPieces();
        res.send(result);
    });

export default handler;
