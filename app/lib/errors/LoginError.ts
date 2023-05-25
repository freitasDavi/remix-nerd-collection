import { AppError } from "./AppError";

export class LoginError extends AppError {

    constructor() {
        super("User or password is not valid");
    }
}