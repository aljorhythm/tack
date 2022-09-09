export type UserForPublic = {
    username?: string;
};

export interface NotLoggedInUser {
    getUserByUsername(username: string): Promise<UserForPublic>;
}
