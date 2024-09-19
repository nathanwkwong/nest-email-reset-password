import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '@nestjs/jwt';

import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        EmailModule,
        JwtModule.register({
            secret: '1234',
            signOptions: { expiresIn: '24h' } // e.g. 30s, 7d, 24h
        }),
        ConfigModule
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
