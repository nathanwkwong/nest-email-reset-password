import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { EmailModule } from './api/email/email.module';

@Module({
    imports: [AuthModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
