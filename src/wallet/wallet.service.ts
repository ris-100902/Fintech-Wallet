import { Injectable } from '@nestjs/common';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WalletService {
  constructor(@InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>
  ){}

  async createWithUser(user: User): Promise<Wallet>{
    const wallet = this.walletRepository.create({user});
    return await this.walletRepository.save(wallet);
  }

  async findAll(): Promise<Wallet[]> {
    return await this.walletRepository.find();
  }

  async findOne(id: number): Promise<Wallet| null> {
    return await this.walletRepository.findOneBy({id});
  }
}
