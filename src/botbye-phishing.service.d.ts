import { OnModuleInit } from "@nestjs/common";
import { type TPhishingInitOptions, type TFetchCatcherOptions, type TUpstreamFetchCatcherResult, type TPhishingModuleApi } from "@botbye/node-core";
import { type IBotByePhishingService } from "./botbye-phishing.types";
declare class BotByePhishingService<T> implements OnModuleInit, IBotByePhishingService<T> {
    private options;
    private phishingModuleApi;
    constructor(options: TPhishingInitOptions, phishingModuleApi: TPhishingModuleApi<T>);
    onModuleInit(): void;
    fetchCatcher(options: TFetchCatcherOptions<T>): Promise<TUpstreamFetchCatcherResult>;
}
export { BotByePhishingService };
