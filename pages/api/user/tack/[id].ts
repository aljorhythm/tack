import { UserClass } from "../domain";
import { findUserById } from "../persistence";
import { getFirstParamValue, tackNextConnect } from "../../../request";
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
    })
    .delete(async (req, res) => {
        const tackId = getFirstParamValue(req.query, "id");
        if (!req.user) {
            throw "no user";
        }
        const result = await req.user.deleteMyTack(tackId!);
        res.send(result);
    });

export default handler;
