import { Module } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ledger } from './entities/ledger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ledger])],
  providers: [LedgerService],
  exports: [LedgerService]
})
export class LedgerModule {}
