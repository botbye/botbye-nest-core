"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPhishingExports = exports.getPhishingProvidersList = void 0;
const botbye_phishing_constants_1 = require("./botbye-phishing.constants");
const botbye_phishing_service_1 = require("./botbye-phishing.service");
const getPhishingProvidersList = (options, phishingModuleApi) => [
    {
        provide: botbye_phishing_constants_1.BOTBYE_PHISHING_SERVICE_DI_TOKEN,
        useClass: (botbye_phishing_service_1.BotByePhishingService),
    },
    {
        provide: botbye_phishing_constants_1.BOTBYE_PHISHING_MODULE_OPTIONS_DI_TOKEN,
        useValue: options,
    },
    {
        provide: botbye_phishing_constants_1.BOTBYE_PHISHING_MODULE_API_DI_TOKEN,
        useValue: phishingModuleApi,
    },
];
exports.getPhishingProvidersList = getPhishingProvidersList;
const getPhishingExports = () => [
    botbye_phishing_constants_1.BOTBYE_PHISHING_SERVICE_DI_TOKEN,
    botbye_phishing_constants_1.BOTBYE_PHISHING_MODULE_API_DI_TOKEN,
];
exports.getPhishingExports = getPhishingExports;
