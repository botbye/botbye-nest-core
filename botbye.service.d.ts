import { OnModuleInit } from "@nestjs/common";
import * as core from "botbye-node-core";
import { IBotByeService, TBotByeServiceOptions, TValidationFunction } from "./botbye.types";
declare class BotByeService<T> implements OnModuleInit, IBotByeService<T> {
    private options;
    private validateRequest;
    constructor(options: TBotByeServiceOptions<T>, validateRequest: TValidationFunction<T>);
    onModuleInit(): void;
    validate(request: T): Promise<core.TBotByeResponse>;
}
export { BotByeService, };
