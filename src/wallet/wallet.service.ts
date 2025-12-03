import { BadRequestException, Injectable } from '@nestjs/common';
import { Wallet } from './entities/wallet.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { LedgerService } from 'src/ledger/ledger.service';
import { Ledger } from 'src/ledger/entities/ledger.entity';

@Injectable()
export class WalletService {
  constructor(@InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private ledgerService: LedgerService,
    private datasource: DataSource
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

  async findOneWithUser(id: number): Promise<Wallet|null> {
    return await this.walletRepository.findOne({
      where: {id : id},
      relations: ['user']
    });
  }

  async transfer(senderWalletId: number, receiverWalletId: number, amount: number): Promise<void>{
    if (amount<=0) throw new BadRequestException('Amount must be positive');
    await this.datasource.transaction(async (manager) => {
      // Load and lock the wallets
      const senderWallet = await manager.findOne(Wallet, {
        where: {id: senderWalletId},
        lock: {mode: 'pessimistic_write'}
      });
      const receiverWallet = await manager.findOne(Wallet, {
        where: {id: receiverWalletId},
        lock: {mode: 'pessimistic_write'}
      });

      if (!senderWallet || !receiverWallet) throw new Error('Wallet not found');
      if (senderWallet.balance < amount) throw new Error('Insufficient balance');

      // Debit from sender
      senderWallet.balance = senderWallet.balance - amount;
      await manager.save(Wallet, senderWallet);
      const debitLedger = manager.create(Ledger, {
        wallet: senderWallet,
        type: 'DEBIT',
        amount: amount,
        balanceAfter: senderWallet.balance
      });
      await manager.save(debitLedger);

      // Credit to receiver
      receiverWallet.balance = receiverWallet.balance + amount;
      await manager.save(Wallet, receiverWallet);
      const creditLedger = manager.create(Ledger, {
        wallet: receiverWallet,
        type: 'CREDIT',
        amount: amount,
        balanceAfter: receiverWallet.balance
      });
      await manager.save(creditLedger);
    });
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
