import { type TInitOptions, type TEvaluationResult, type TEvent, type TRequestOrExtended } from "@botbye/node-core";
interface IBotByeService<T> {
    evaluate(event: TEvent<TRequestOrExtended<T>>): Promise<TEvaluationResult>;
}
type TTokenExtractor<T> = (request: T) => string | null | undefined;
type TBotByeModuleOptions<T = unknown> = TInitOptions & {
    tokenExtractor?: TTokenExtractor<T>;
};
export { IBotByeService, TTokenExtractor, TBotByeModuleOptions, };
