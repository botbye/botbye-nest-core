import { TBotByeServiceOptions, TValidationFunction } from "./botbye.types";
import { BotByeService } from "./botbye.service";
declare const getProvidersList: <T>(options: TBotByeServiceOptions<T>, validateRequest: TValidationFunction<T>) => ({
    provide: string;
    useClass: {
        new (options: TBotByeServiceOptions<T>, validateRequest: TValidationFunction<T>): BotByeService<T>;
    };
    useValue?: undefined;
} | {
    provide: string;
    useValue: TValidationFunction<T>;
    useClass?: undefined;
} | {
    provide: string;
    useValue: TBotByeServiceOptions<T>;
    useClass?: undefined;
})[];
declare const getExports: <T>() => {
    provide: string;
    useClass: {
        new (options: TBotByeServiceOptions<T>, validateRequest: TValidationFunction<T>): BotByeService<T>;
    };
}[];
export { getProvidersList, getExports, };
