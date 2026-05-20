import { type TBotByeModuleOptions } from "./botbye.types";
import { type TModuleApi } from "@botbye/node-core";
import { BotByeService } from "./botbye.service";
declare const getProvidersList: <T>(options: TBotByeModuleOptions<T>, moduleApi: TModuleApi<T>) => ({
    provide: string;
    useClass: {
        new (options: import("@botbye/node-core").TInitOptions, moduleApi: TModuleApi<T>): BotByeService<T>;
    };
    useValue?: undefined;
} | {
    provide: string;
    useValue: TBotByeModuleOptions<T>;
    useClass?: undefined;
} | {
    provide: string;
    useValue: TModuleApi<T>;
    useClass?: undefined;
} | {
    provide: string;
    useValue: import("./botbye.types").TTokenExtractor<T>;
    useClass?: undefined;
})[];
declare const getExports: () => string[];
export { getProvidersList, getExports };
