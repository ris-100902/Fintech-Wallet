import { Injectable } from '@nestjs/common';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { LedgerService } from 'src/ledger/ledger.service';

@Injectable()
export class WalletService {
  constructor(@InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private ledgerService: LedgerService
  ){}

  async createWithUser(user: User): Promise<Wallet>{
    const wallet = this.walletRepository.create({user});
    const savedWallet = await this.walletRepository.save(wallet);
    await this.ledgerService.addTransaction(wallet, 'CREDIT', 0, 0);
    return savedWallet; 
  }

  async findAll(): Promise<Wallet[]> {
    return await this.walletRepository.find();
  }

  async findOne(id: number): Promise<Wallet| null> {
    return await this.walletRepository.findOneBy({id});
  }

  async credit(user: User, amount: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: {user: {id: user.id}}
    });
    if (!wallet){
      throw new Error("No such Wallet");
    }

    wallet.balance = Number(wallet?.balance) + amount; 
    const updatedWallet = await this.walletRepository.save(wallet);
    await this.ledgerService.addTransaction(wallet, 'CREDIT', amount, updatedWallet.balance);
    return updatedWallet;
  }

  async debit(user: User, amount: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: {user: {id: user.id}}
    });
    if (!wallet) throw new Error("No such Wallet");
    if (wallet.balance < amount) throw new Error("Insufficient balance");

    wallet.balance = wallet.balance - amount;
    const updatedWallet = await this.walletRepository.save(wallet);
    await this.ledgerService.addTransaction(wallet, 'DEBIT', amount, updatedWallet.balance);
    return updatedWallet;
  }
}
