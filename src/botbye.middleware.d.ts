import { NestMiddleware } from "@nestjs/common";
import { type IBotByeService, type TTokenExtractor } from "./botbye.types";
import { type TEvaluationResult, type TModuleApi } from "@botbye/node-core";
declare class BotByeMiddleware<T> implements NestMiddleware {
    private botbyeService;
    private moduleApi;
    private tokenExtractor;
    constructor(botbyeService: IBotByeService<T>, moduleApi: TModuleApi<T>, tokenExtractor: TTokenExtractor<T> | null);
    use(request: T & {
        __botbye_response: TEvaluationResult;
    }, _: unknown, next: () => void): Promise<void>;
}
export { BotByeMiddleware };
