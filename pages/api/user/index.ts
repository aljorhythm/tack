import { findUserById } from "./persistence";
import { tackNextConnect } from "../../request";
import { createUser, CreateUserRequest, UserClass } from "./domain";
import { SignUpResponse } from "./types";

const handler = tackNextConnect(findUserById, UserClass)
    .post(async (req, res) => {
        const user: CreateUserRequest = req.body as CreateUserRequest;
        try {
            const result: SignUpResponse = { ...(await createUser(user)), errors: {} };
            res.status(200).json(result);
        } catch (errors) {
            const response: SignUpResponse = { errors: errors as { [key: string]: string } };
            res.status(400).json(response);
        }
    })
    .get(async (req, res) => {
        if (req.user) {
            res.status(200).json(req.user);
        }
    });

export default handler;
