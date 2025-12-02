import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ledger } from './entities/ledger.entity';
import { Repository } from 'typeorm';
import { Wallet } from 'src/wallet/entities/wallet.entity';

@Injectable()
export class LedgerService {
    constructor(
        @InjectRepository(Ledger)
        private ledgerRepository: Repository<Ledger> 
    ){}

    async addTransaction(wallet: Wallet, type: 'CREDIT'|'DEBIT', amount: number, balanceAfter: number ): Promise<Ledger>{
        const transaction = this.ledgerRepository.create({wallet, type, amount, balanceAfter});
        return await this.ledgerRepository.save(transaction);
    }

    async getForWallet(walletId: number): Promise<Ledger[]>{
        return await this.ledgerRepository.find({
            where: {wallet: {id: walletId}},
            order: {createdAt: 'DESC'}
        });
    }
}
