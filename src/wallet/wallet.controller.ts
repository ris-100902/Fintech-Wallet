import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  findAll() {
    return this.walletService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Wallet|null> {
    return await this.walletService.findOne(+id);
  }

  @Post(':id/add-money')
  async addMoney(@Param('id') id: string, @Body() amountBody: Record<string,number>): Promise<Wallet> {
    const wallet = await this.walletService.findOneWithUser(+id);
    if (!wallet) throw new Error('Wallet not found');

    return this.walletService.credit(wallet.user, amountBody.amount);
  }

  @Post(':id/send-money')
  async sendMoney(@Param('id')id: string, @Body() moneyWithId: Record<string,number>): Promise<Wallet|null> {
    await this.walletService.transfer(+id, moneyWithId.id, moneyWithId.amount);
    return await this.walletService.findOne(+id);
  }
}
