import { type TBotByePhishingModuleOptions } from "./botbye-phishing.types";
import { type TPhishingModuleApi } from "@botbye/node-core";
import { BotByePhishingService } from "./botbye-phishing.service";
declare const getPhishingProvidersList: <T>(options: TBotByePhishingModuleOptions, phishingModuleApi: TPhishingModuleApi<T>) => ({
    provide: string;
    useClass: {
        new (options: import("@botbye/node-core").TPhishingInitOptions, phishingModuleApi: TPhishingModuleApi<T>): BotByePhishingService<T>;
    };
    useValue?: undefined;
} | {
    provide: string;
    useValue: import("@botbye/node-core").TPhishingInitOptions;
    useClass?: undefined;
} | {
    provide: string;
    useValue: TPhishingModuleApi<T>;
    useClass?: undefined;
})[];
declare const getPhishingExports: () => string[];
export { getPhishingProvidersList, getPhishingExports };
