import { type TPhishingInitOptions, type TFetchCatcherOptions, type TUpstreamFetchCatcherResult } from "@botbye/node-core";
interface IBotByePhishingService<T> {
    fetchCatcher(options: TFetchCatcherOptions<T>): Promise<TUpstreamFetchCatcherResult>;
}
type TBotByePhishingModuleOptions = TPhishingInitOptions;
export { IBotByePhishingService, TBotByePhishingModuleOptions, };
