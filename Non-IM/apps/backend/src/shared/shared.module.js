import { __decorate } from "tslib";
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { isDev } from '~/global/env';
import { HelperModule } from './helper/helper.module';
import { LoggerModule } from './logger/logger.module';
import { MailerModule } from './mailer/mailer.module';
import { RedisModule } from './redis/redis.module';
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    Global(),
    Module({
        imports: [
            // logger
            LoggerModule.forRoot(),
            // http
            HttpModule,
            // schedule
            ScheduleModule.forRoot(),
            // rate limit
            ThrottlerModule.forRoot([
                {
                    limit: 20,
                    ttl: 60000,
                },
            ]),
            EventEmitterModule.forRoot({
                wildcard: true,
                delimiter: '.',
                newListener: false,
                removeListener: false,
                maxListeners: 20,
                verboseMemoryLeak: isDev,
                ignoreErrors: false,
            }),
            // redis
            RedisModule,
            // mailer
            MailerModule,
            // helper
            HelperModule,
        ],
        exports: [HttpModule, MailerModule, RedisModule, HelperModule],
    })
], SharedModule);
export { SharedModule };
//# sourceMappingURL=shared.module.js.map