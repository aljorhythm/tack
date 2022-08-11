import { createPiece, getPiecesByUserId } from "../piece/persistence";
import { Piece } from "../piece/types";
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
        const piece: Piece = {
            url: createFrom.url,
            userId: this.id,
        };

        const id = await createPiece(piece);
        if (!id) {
            throw new Error(`failed to create piece from ${createFrom}`);
        }
        return id;
    }

    async getPieces(): Promise<Piece[]> {
        return await getPiecesByUserId(this.id);
    }

    toObject(): UserType {
        return {
            id: this.id,
            email: this.email,
        };
    }
}
