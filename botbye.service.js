"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotByeService = void 0;
const common_1 = require("@nestjs/common");
const botbye_constants_1 = require("./botbye.constants");
const core = require("botbye-node-core");
core.initPackageInfo({ name: 'NodeJS-Nest-Express', version: '0.1.0' });
let BotByeService = class BotByeService {
    constructor(options, validateRequest) {
        this.options = options;
        this.validateRequest = validateRequest;
    }
    onModuleInit() {
        core.init(this.options);
    }
    validate(request) {
        var _a, _b;
        return this.validateRequest({
            request,
            token: this.options.tokenExtractor(request),
            customFields: (_b = (_a = this.options).customFieldsExtractor) === null || _b === void 0 ? void 0 : _b.call(_a, request),
        });
    }
};
exports.BotByeService = BotByeService;
exports.BotByeService = BotByeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(botbye_constants_1.BOTBYE_MODULE_OPTIONS_DI_TOKEN)),
    __param(1, (0, common_1.Inject)(botbye_constants_1.BOTBYE_MODULE_VALIDATE_REQUEST_DI_TOKEN)),
    __metadata("design:paramtypes", [Object, Function])
], BotByeService);
