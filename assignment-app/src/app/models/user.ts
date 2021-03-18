export class User {
    id: number;
    token: string;
    username: string;
    pwd: string;
    firstname: string;
    lastname: string;
    isAuthenticated: boolean;
    authdata?: string;
}
