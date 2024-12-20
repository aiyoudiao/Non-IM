import { __decorate } from "tslib";
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModule } from '../system/menu/menu.module';
import { ParamConfigModule } from '../system/param-config/param-config.module';
import { RoleModule } from '../system/role/role.module';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
const providers = [UserService];
let UserModule = class UserModule {
};
UserModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forFeature([UserEntity]),
            RoleModule,
            MenuModule,
            ParamConfigModule,
        ],
        controllers: [UserController],
        providers: [...providers],
        exports: [TypeOrmModule, ...providers],
    })
], UserModule);
export { UserModule };
//# sourceMappingURL=user.module.js.map