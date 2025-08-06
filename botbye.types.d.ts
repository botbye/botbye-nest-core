import { TBotByeInitOptions, TBotByeResponse, TValidateRequestOptions } from "botbye-node-core";
interface IBotByeService<T> {
    validate: (request: T) => Promise<TBotByeResponse>;
}
type TValidationFunction<T> = (options: Omit<TValidateRequestOptions, "requestInfo" | "headers"> & {
    request: T;
}) => Promise<TBotByeResponse>;
type TBotByeServiceOptions<T> = TBotByeInitOptions & {
    tokenExtractor: (request: T) => string;
    customFieldsExtractor?: (request: T) => Record<string, string>;
};
export { IBotByeService, TValidationFunction, TBotByeServiceOptions, };
