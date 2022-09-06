import { findUserById } from "../../user/persistence";
import { UserClass } from "../../user/domain";
import { tackNextConnect } from "../../../request";

const handler = tackNextConnect(findUserById, UserClass).get(async (req, res) => {
    const { id: tackId } = req.query;
    const text = await req.user!.getTackText(tackId as string);
    res.send({ text });
});

export default handler;
