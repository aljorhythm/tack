import { tackNextConnect } from "../../request";
import { UserClass } from "../user/domain";
import { findUserById } from "../user/persistence";
import { CreateTackFrom } from "../user/types";

const handler = tackNextConnect(findUserById, UserClass).post(async (req, res) => {
    const tack = req.body;
    const result = await req.user!.addTack(tack as CreateTackFrom);
    res.send(result);
});

export default handler;
