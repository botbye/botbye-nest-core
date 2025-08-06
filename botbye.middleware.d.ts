import { NestMiddleware } from "@nestjs/common";
import { IBotByeService } from "./botbye.types";
import { TBotByeResponse } from "botbye-node-core";
declare class BotByeMiddleware<T> implements NestMiddleware {
    private botbyeService;
    constructor(botbyeService: IBotByeService<T>);
    use(request: T & {
        __botbye_response: TBotByeResponse;
    }, _: any, next: () => void): Promise<void>;
}
export { BotByeMiddleware, };
