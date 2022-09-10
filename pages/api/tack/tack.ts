import { CreateTackFrom } from "../user/types";
import { createForDb } from "./domain";
import * as persistence from "./persistence";
import { Tack } from "./types";

export async function create(createFrom: CreateTackFrom, userId: string): Promise<string | null> {
    return await persistence.createTack(await createForDb(createFrom, userId));
}

export async function findOneById(id: string): Promise<Tack | null> {
    return persistence.findOneById(id);
}
