"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotByeResponse = void 0;
const common_1 = require("@nestjs/common");
const BotByeResponse = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.__botbye_response || (request.raw || {}).__botbye_response;
});
exports.BotByeResponse = BotByeResponse;
