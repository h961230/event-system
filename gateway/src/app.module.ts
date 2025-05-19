import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwtAuth.guard';
import { GatewayRoleGuard } from './auth/gatewayRole.guard';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: GatewayRoleGuard },
  ],
})
export class AppModule {}
