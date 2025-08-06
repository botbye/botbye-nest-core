"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExports = exports.getProvidersList = void 0;
const botbye_constants_1 = require("./botbye.constants");
const botbye_service_1 = require("./botbye.service");
const getProvidersList = (options, validateRequest) => [
    {
        provide: botbye_constants_1.BOTBYE_SERVICE_DI_TOKEN,
        useClass: (botbye_service_1.BotByeService),
    },
    {
        provide: botbye_constants_1.BOTBYE_MODULE_VALIDATE_REQUEST_DI_TOKEN,
        useValue: validateRequest,
    },
    {
        provide: botbye_constants_1.BOTBYE_MODULE_OPTIONS_DI_TOKEN,
        useValue: options,
    },
];
exports.getProvidersList = getProvidersList;
const getExports = () => [
    {
        provide: botbye_constants_1.BOTBYE_SERVICE_DI_TOKEN,
        useClass: (botbye_service_1.BotByeService),
    },
];
exports.getExports = getExports;
