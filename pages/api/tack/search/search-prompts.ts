import { tackNextConnect } from "../../../request";
import { UserClass } from "../../user/domain";
import { findUserById } from "../../user/persistence";

const handler = tackNextConnect(findUserById, UserClass).get(async (req, res) => {
    const prompts = await req.user?.getSearchPrompts();
    res.send({ prompts });
});

export default handler;
