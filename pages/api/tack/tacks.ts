import { tackNextConnect } from "../../request";
import { UserClass } from "../user/domain";
import { findUserById } from "../user/persistence";

const handler = tackNextConnect(findUserById, UserClass).get(async (req, res) => {
    let { query } = req.query;
    query = Array.isArray(query) ? query.join(" ") : query;
    const result = await req.user!.getTacks(query);
    res.send(result);
});

export default handler;
