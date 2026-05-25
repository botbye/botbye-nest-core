# @botbye/nest-core

[BotBye!](https://botbye.com) NestJS integration core — the low-level building block used by `@botbye/nest-express` and `@botbye/nest-fastify`.

Use this package to build a BotBye integration for a NestJS application running on a custom platform adapter. If you are using Express or Fastify, use the framework-specific package instead:

- [`@botbye/nest-express`](https://www.npmjs.com/package/@botbye/nest-express) — NestJS + Express
- [`@botbye/nest-fastify`](https://www.npmjs.com/package/@botbye/nest-fastify) — NestJS + Fastify

## Install

```bash
npm i @botbye/nest-core
```

```bash
yarn add @botbye/nest-core
```

Requires `@nestjs/common >= 10` as a peer dependency. `@botbye/node-core` is installed automatically as a direct dependency.

## Building a custom integration

To wire BotBye into a custom NestJS platform, implement a `BotByeModule` using `getProvidersList` and `getExports`. `@botbye/node-core` is a direct dependency of `@botbye/nest-core` and is installed automatically — import `moduleApiFactory` and an HTTP client from it directly.

```typescript
// botbye.module.ts
import { Module, DynamicModule } from "@nestjs/common";
import { getProvidersList, getExports, type TBotByeModuleOptions } from "@botbye/nest-core";
import { moduleApiFactory } from "@botbye/node-core";
import { nodeHttpClient } from "@botbye/node-core/node-http-client";
import type { MyRequest } from "my-framework";

const createModuleApi = () =>
  moduleApiFactory<MyRequest>({
    httpClient: nodeHttpClient,
    requestInfoExtractor: (req, global) => {
      try {
        return {
          ip: req.ip ?? "0.0.0.0",
          headers: req.headers as Record<string, string>,
          requestMethod: req.method,
          requestUri: req.url,
        };
      } catch {
        global.logger.warn("Failed to extract request info");
        return { ip: "0.0.0.0", headers: {} };
      }
    },
  });

@Module({})
export class BotByeModule {
  static register(options: TBotByeModuleOptions<MyRequest>): DynamicModule {
    return {
      module: BotByeModule,
      providers: getProvidersList(options, createModuleApi()),
      exports: getExports(),
    };
  }
}
```

Register the module in your root module:

```typescript
import { Module } from "@nestjs/common";
import { BotByeModule } from "./botbye.module";

@Module({
  imports: [
    BotByeModule.register({
      // Use your project server-key
      serverKey: "00000000-0000-0000-0000-000000000000",
    }),
  ],
})
export class AppModule {}
```

`getProvidersList` registers four providers under the following DI tokens — all exported by `getExports()`:

| Token | What it provides |
|---|---|
| `BOTBYE_SERVICE_DI_TOKEN` | `BotByeService<T>` — the injectable service for calling `evaluate` |
| `BOTBYE_MODULE_API_DI_TOKEN` | The `TModuleApi<T>` instance created by `moduleApiFactory` |
| `BOTBYE_MODULE_OPTIONS_DI_TOKEN` | The options object passed to `register()` |
| `BOTBYE_TOKEN_EXTRACTOR_DI_TOKEN` | The `tokenExtractor` function, or `null` if not provided |

### `register` options

`TBotByeModuleOptions<T>` extends the standard `init` options with one additional field:

| Option | Type | Required | Description |
|---|---|---|---|
| `serverKey` | `string` | Yes | Server key from your BotBye project |
| `url` | `string` | No | Override BotBye API endpoint (default: `https://verify.botbye.com`) |
| `logger.level` | `"error" \| "warn" \| "info" \| "debug" \| "log"` | No | Log level (default: `"info"`) |
| `logger.logger` | `TLogger` | No | Custom logger instance implementing `{ error, warn, info, debug, log }` |
| `timeouts.evaluate` | `number` | No | Timeout in milliseconds for each `evaluate` call |
| `tokenExtractor` | `(request: T) => string \| null \| undefined` | No* | Extracts the BotBye token from the request. *Required when using `BotByeMiddleware` — without it the middleware skips evaluation and returns an error result. |

## Usage

After registering the module, inject `IBotByeService` via `BOTBYE_SERVICE_DI_TOKEN` to call `evaluate` from guards, controllers, or services.

There are three event types — `validate`, `risk`, and `full` — each suited for a different layer of your application.

---

### `validate` — edge-level bot check

Use at the outermost layer — guard, route handler, middleware — when you just want to know: **was this request made by a bot?** No user or domain context needed.

**Event fields:**

```typescript
{
  type: "validate";
  request:
    // Option A: pass the framework request object directly — SDK extracts everything automatically
    | { request: T; token?: string | null }
    // Option B: construct request info manually
    | { ip: string; headers: Record<string, string>; requestMethod?: string | null; requestUri?: string | null; token?: string | null };
  customFields?: Record<string, string>;
}
```

The `requestInfoExtractor` configured in `moduleApiFactory` handles extraction from the request object automatically for Option A. You can also pass request info manually — see Option B above. The `token` is a one-time token generated by the [BotBye client-side SDK](https://botbye.com/docs/client-side/npm-module) that contains information about the user's device. Pass whatever the client sent; if no token is received, the decision will be `"BLOCK"` due to an invalid token.

```typescript
import { Injectable, CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { BOTBYE_SERVICE_DI_TOKEN, IBotByeService } from "@botbye/nest-core";
import type { MyRequest } from "my-framework";

@Injectable()
export class BotProtectionGuard implements CanActivate {
  constructor(
    @Inject(BOTBYE_SERVICE_DI_TOKEN) private readonly botbye: IBotByeService<MyRequest>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<MyRequest>();

    const result = await this.botbye.evaluate({
      type: "validate",
      request: {
        request,
        // "x-botbye-token" is an example — pass the token from wherever you store it
        token: request.headers["x-botbye-token"] ?? null,
      },
    });

    return result.decision !== "BLOCK";
  }
}
```

---

### `risk` — domain-level risk scoring

Use inside services that already know the user: auth, payments, account management, etc. The purpose shifts from "is this a bot?" to **"is something suspicious happening for this user?"** — credential stuffing, account takeover, account sharing, logins from a new geo.

**Event fields:**

```typescript
{
  type: "risk";
  request:
    | { ip: string; headers?: Record<string, string>; requestMethod?: string | null; requestUri?: string | null; token?: string | null }
    | { request: T };
  event: {
    type: string;
    status: "ATTEMPTED" | "SUCCESSFUL" | "FAILED" | "UNKNOWN";
  };
  user: {
    accountId: string;
    username?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  customFields?: Record<string, string>;
  botbyeResult?: string;
}
```

`event` and `user` are the key fields here — they define what action is being performed and who is performing it, which is what drives the risk score. `ip` is equally important: BotBye tracks which IPs access the account to detect patterns like account sharing, credential stuffing, and suspicious geo logins. Pass it directly as `{ ip }`, or pass the request object if that's more convenient.

```typescript
import { Injectable, Inject } from "@nestjs/common";
import { BOTBYE_SERVICE_DI_TOKEN, IBotByeService } from "@botbye/nest-core";
import type { MyRequest } from "my-framework";

@Injectable()
export class AuthService {
  constructor(
    @Inject(BOTBYE_SERVICE_DI_TOKEN) private readonly botbye: IBotByeService<MyRequest>
  ) {}

  async onLoginAttempt(ip: string, userId: string, email: string, loginSucceeded: boolean) {
    const result = await this.botbye.evaluate({
      type: "risk",
      request: { ip },
      event: {
        type: "login",
        status: loginSucceeded ? "SUCCESSFUL" : "FAILED",
        // "SUCCESSFUL" | "FAILED" | "ATTEMPTED" | "UNKNOWN"
      },
      user: {
        accountId: userId,
        email,
      },
    });

    if (result.decision === "BLOCK") {
      // Lock account, trigger MFA, send alert, etc.
    }
  }
}
```

---

### `full` — edge check and domain scoring in one call

Use when you have all context at once: raw request, token, user, and event. Equivalent to running `validate` and `risk` in a single call. A login endpoint is a typical example — it receives the HTTP request and immediately knows the user and outcome.

**Event fields:**

```typescript
{
  type: "full";
  request:
    | { request: T; token?: string | null }
    | { ip: string; headers: Record<string, string>; requestMethod?: string | null; requestUri?: string | null; token?: string | null };
  event: {
    type: string;
    status: "ATTEMPTED" | "SUCCESSFUL" | "FAILED" | "UNKNOWN";
  };
  user: {
    accountId: string;
    username?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  customFields?: Record<string, string>;
}
```

```typescript
import { Injectable, Inject, ForbiddenException } from "@nestjs/common";
import { BOTBYE_SERVICE_DI_TOKEN, IBotByeService } from "@botbye/nest-core";
import type { MyRequest } from "my-framework";

@Injectable()
export class AuthService {
  constructor(
    @Inject(BOTBYE_SERVICE_DI_TOKEN) private readonly botbye: IBotByeService<MyRequest>
  ) {}

  async login(request: MyRequest, email: string, password: string) {
    const user = await this.findUser(email);
    const loginSucceeded = user && (await this.checkPassword(user, password));

    const result = await this.botbye.evaluate({
      type: "full",
      request: {
        request,
        // "x-botbye-token" is an example — pass the token from wherever you store it
        token: request.headers["x-botbye-token"] ?? null,
      },
      event: {
        type: "login",
        status: loginSucceeded ? "SUCCESSFUL" : "FAILED",
      },
      user: {
        accountId: user?.id ?? "unknown",
        email,
      },
    });

    if (result.decision === "BLOCK") {
      throw new ForbiddenException();
    }

    // proceed normally
  }
}
```

---

## Response

`evaluate` always returns a `Promise<TEvaluationResult>`:

```typescript
type TEvaluationResult =
  | {
      decision: "ALLOW" | "BLOCK" | "CHALLENGE";
      request_id: string;
      risk_score: number;
      scores: Record<string, number>;
      signals: string[];
      botbye_result?: string;
    }
  | {
      decision: "ALLOW" | "BLOCK" | "CHALLENGE";
      botbye_result?: string;
      error: { message: string };
    };
```

Check `result.decision` to decide how to handle the request:

- `"ALLOW"` — request appears legitimate, proceed normally
- `"BLOCK"` — bot or suspicious activity detected, block the request
- `"CHALLENGE"` — uncertain, consider issuing a CAPTCHA, MFA, or additional verification step

When the response contains an `error` field, BotBye could not evaluate the request (e.g. invalid server key). In that case `decision` defaults to `"ALLOW"` so that a misconfiguration does not block real users — but you should monitor and fix the underlying error.

### Response examples

Blocked (bot detected):

```json
{
  "request_id": "f77b2abd-c5d7-44f0-be4f-174b04876583",
  "decision": "BLOCK",
  "risk_score": 0.95,
  "scores": { "bot": 0.95 },
  "signals": ["AutomationTool"]
}
```

Allowed:

```json
{
  "request_id": "f77b2abd-c5d7-44f0-be4f-174b04876583",
  "decision": "ALLOW",
  "risk_score": 0.05,
  "scores": { "bot": 0.05, "ato": 0.02 },
  "signals": []
}
```

Challenge:

```json
{
  "request_id": "f77b2abd-c5d7-44f0-be4f-174b04876583",
  "decision": "CHALLENGE",
  "risk_score": 0.65,
  "scores": { "bot": 0.65 },
  "signals": ["SuspiciousFingerprint"],
  "challenge": { "type": "captcha", "token": "..." }
}
```

Invalid `serverKey`:

```json
{
  "decision": "ALLOW",
  "error": { "message": "[BotBye] Bad Request: Invalid Server Key" }
}
```

## Middleware usage

`BotByeMiddleware` evaluates every incoming request automatically and stores the result on `request.__botbye_response`. Use the `@BotByeResponse()` parameter decorator to access the result in a controller without calling `evaluate` manually.

For `BotByeMiddleware` to work, `tokenExtractor` must be provided in `register()` options so the middleware knows where to find the BotBye token:

```typescript
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { BotByeMiddleware } from "@botbye/nest-core";
import { BotByeModule } from "./botbye.module";

@Module({
  imports: [
    BotByeModule.register({
      // Use your project server-key
      serverKey: "00000000-0000-0000-0000-000000000000",
      // "x-botbye-token" is an example — pass the token from wherever you store it
      tokenExtractor: (req) => req.headers["x-botbye-token"],
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Global: protect all routes
    consumer.apply(BotByeMiddleware).forRoutes("*");
  }
}
```

Access the result in a controller with `@BotByeResponse()`:

```typescript
import { Controller, Post, ForbiddenException } from "@nestjs/common";
import { BotByeResponse } from "@botbye/nest-core";
import type { TEvaluationResult } from "@botbye/nest-core";

@Controller()
export class AppController {
  @Post("/api/submit")
  async submit(@BotByeResponse() result: TEvaluationResult) {
    if (result.decision === "BLOCK") {
      throw new ForbiddenException();
    }
    // proceed normally
  }
}
```

To apply middleware only to specific routes, replace `.forRoutes("*")` with a path or route descriptor:

```typescript
// Scoped: protect only routes registered under "protected"
consumer.apply(BotByeMiddleware).forRoutes("protected");
```

