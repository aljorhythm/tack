import type { NextApiResponse } from "next";
import nc from "next-connect";

import attachUserToRequest from "../../request";
import { TackApiRequest } from "../../request";
import { UserClass } from "../user/domain";
import { findUserById } from "../user/persistence";
import { CreatePieceFrom } from "../user/types";

const handler = nc<TackApiRequest, NextApiResponse>()
    .use(attachUserToRequest(findUserById, UserClass))
    .post(async (req, res) => {
        const tack = req.body;
        const result = await req.user!.addPiece(tack as CreatePieceFrom);
        res.send(result);
    });

export default handler;
