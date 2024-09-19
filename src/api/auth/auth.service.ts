import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { google, Auth, oauth2_v2 } from 'googleapis';
import { JwtService } from '@nestjs/jwt';
import { dbUsers } from 'src/constants/user';

@Injectable()
export class AuthService {
    oauthClient: Auth.OAuth2Client;
    constructor(
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService
    ) {
        const clientID = this.configService.get('GOOGLE_CLIENT_ID');
        const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
        this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
    }

    async forgotPassword(email: string): Promise<void> {
        const user = dbUsers.find((user) => user.email === email);

        if (!user) {
            throw new NotFoundException(`No user found for email: ${email}`);
        }
        await this.emailService.sendResetPasswordLink(email);
    }

    async resetPassword(token: string, password: string): Promise<void> {
        const email = await this.emailService.decodeConfirmationToken(token);

        const user = dbUsers.find((user) => user.email === email);
        if (!user) {
            throw new NotFoundException(`No user found for email: ${email}`);
        }

        user.password = password;
        delete user.resetToken; // remove the token after the password is updated
    }
}
