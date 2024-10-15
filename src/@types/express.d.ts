import { UserDto } from "../dto/UserDto";

namespace Express {
    interface Request {
        user?: UserDto
    }
}