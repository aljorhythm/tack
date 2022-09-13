import { UserClass } from "../domain";
import { findUserById } from "../persistence";
import { tackNextConnect } from "../../../request";
import { UserEditTagResponse } from "../types";

const handler = tackNextConnect(findUserById, UserClass)
    .get(async (req, res) => {
        const { id: tackId } = req.query;
        const result = await req.user!.getTack(tackId as string);
        res.send(result);
    })
    .patch(async (req, res) => {
        const { id: tackId } = req.query;
        const { tagsString } = req.body;
        const result: UserEditTagResponse = await req.user!.editTags(
            tackId as string,
            tagsString as string,
        );
        res.send(result);
    });

export default handler;
