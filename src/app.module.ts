import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'troubador1',
      database: 'fintech_wallet',
      autoLoadEntities: true,
      synchronize: true
    }),
    AuthModule,
    UsersModule,
    WalletModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
