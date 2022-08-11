import type { NextApiResponse } from "next";
import { CreateUserRequest, createUser, findUserById } from "./persistence";
import nc from "next-connect";
import attachUserToRequest from "../../request";
import { TackApiRequest } from "../../request";
import { UserClass } from "./domain";

const handler = nc<TackApiRequest, NextApiResponse>()
    .use(attachUserToRequest(findUserById, UserClass))
    .post(async (req, res) => {
        const user: CreateUserRequest = req.body as CreateUserRequest;
        const response = await createUser(user);
        res.status(200).json(response);
    })
    .get(async (req, res) => {
        if (req.user) {
            res.status(200).json(req.user);
        }
    });

export default handler;
