import {NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from 'express'


// implements는 extends랑 다름
// export class JwtMiddleware implements NestMiddleware {
//     use(req: Request, res: Response, next: NextFunction) {
//         console.log(req.headers.authorization)
//         next();
//     }
// }

export function jwtMiddleware (req: Request, res: Response, next:NextFunction) {
    console.log(req.headers)
    next();
}