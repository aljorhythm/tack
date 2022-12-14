export type Tack = {
    url: string;
    userId: string;
    id: string;
    tags: Array<string>;
    created_at: Date;
    title: string | null;
};

export type DbTack = {
    url: string;
    userId: ObjectId;
    _id?: ObjectId;
    tags: Array<string>;
    created_at: Date;
    title: string | null;
};
