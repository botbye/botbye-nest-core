"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExports = exports.getProvidersList = void 0;
const botbye_constants_1 = require("./botbye.constants");
const botbye_service_1 = require("./botbye.service");
const getProvidersList = (options, moduleApi) => {
    var _a;
    return [
        {
            provide: botbye_constants_1.BOTBYE_SERVICE_DI_TOKEN,
            useClass: (botbye_service_1.BotByeService),
        },
        {
            provide: botbye_constants_1.BOTBYE_MODULE_OPTIONS_DI_TOKEN,
            useValue: options,
        },
        {
            provide: botbye_constants_1.BOTBYE_MODULE_API_DI_TOKEN,
            useValue: moduleApi,
        },
        {
            provide: botbye_constants_1.BOTBYE_TOKEN_EXTRACTOR_DI_TOKEN,
            useValue: (_a = options.tokenExtractor) !== null && _a !== void 0 ? _a : null,
        },
    ];
};
exports.getProvidersList = getProvidersList;
const getExports = () => [
    botbye_constants_1.BOTBYE_SERVICE_DI_TOKEN,
    botbye_constants_1.BOTBYE_MODULE_API_DI_TOKEN,
    botbye_constants_1.BOTBYE_TOKEN_EXTRACTOR_DI_TOKEN,
];
exports.getExports = getExports;
