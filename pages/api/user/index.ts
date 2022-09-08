import { findUserById } from "./persistence";
import { tackNextConnect } from "../../request";
import { createUser, CreateUserRequest, UserClass } from "./domain";

const handler = tackNextConnect(findUserById, UserClass)
    .post(async (req, res) => {
        const user: CreateUserRequest = req.body as CreateUserRequest;
        try {
            const response = await createUser(user);
            res.status(200).json(response);
        } catch (errors) {
            res.status(400).json({ errors });
        }
    })
    .get(async (req, res) => {
        if (req.user) {
            res.status(200).json(req.user);
        }
    });

export default handler;
