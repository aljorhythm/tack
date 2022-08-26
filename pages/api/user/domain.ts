import { Filter } from "mongodb";
import { sanitizeTag } from "../tack/helpers";
import { createPiece, getTacksByUserId } from "../tack/persistence";
import { PieceClass } from "../tack/tack";
import { Piece } from "../tack/types";
import { CreatePieceFrom, User, UserType } from "./types";

type ConstructUserFrom = UserType;
export class UserClass implements User {
    id: string;
    email: string;

    constructor(createFrom: ConstructUserFrom) {
        this.id = createFrom.id;
        this.email = createFrom.email;
    }

    async addPiece(createFrom: CreatePieceFrom): Promise<{ id: string }> {
        const tack: Piece = new PieceClass(createFrom, this.id);

        const id = await createPiece(tack);
        if (!id) {
            throw new Error(`failed to create tack from ${createFrom}`);
        }
        return id;
    }

    async getTacks(query?: string): Promise<Piece[]> {
        let filter: Filter<Piece> | undefined;
        if (query === "") {
            return [];
        }
        if (query) {
            filter = { tags: { $all: query.split(" ").map(sanitizeTag) } };
        }
        return await getTacksByUserId(this.id, filter);
    }

    toObject(): UserType {
        return {
            id: this.id,
            email: this.email,
        };
    }
}
