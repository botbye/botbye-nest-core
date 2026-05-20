import { OnModuleInit } from "@nestjs/common";
import { type TInitOptions, type TEvent, type TRequestOrExtended, type TEvaluationResult, type TModuleApi } from "@botbye/node-core";
import { type IBotByeService } from "./botbye.types";
declare class BotByeService<T> implements OnModuleInit, IBotByeService<T> {
    private options;
    private moduleApi;
    constructor(options: TInitOptions, moduleApi: TModuleApi<T>);
    onModuleInit(): void;
    evaluate(event: TEvent<TRequestOrExtended<T>>): Promise<TEvaluationResult>;
}
export { BotByeService };
