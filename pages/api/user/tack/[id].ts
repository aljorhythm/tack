import { UserClass } from "../domain";
import { findUserById } from "../persistence";
import { tackNextConnect } from "../../../request";

const handler = tackNextConnect(findUserById, UserClass)
    .get(async (req, res) => {
        const { id: tackId } = req.query;
        const result = await req.user!.getTack(tackId as string);
        res.send(result);
    })
    .patch(async (req, res) => {
        const { id: tackId } = req.query;
        const { tagsString } = req.body;
        const result = await req.user!.editTags(tackId as string, tagsString as string);
        res.send(result);
    });

export default handler;
