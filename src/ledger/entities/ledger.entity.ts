import { Wallet } from "src/wallet/entities/wallet.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ledger{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Wallet, (wallet) => wallet.ledger, {onDelete: 'CASCADE'})
    wallet: Wallet;

    @Column()
    type: 'CREDIT' | 'DEBIT';

    @Column({type: 'decimal'})
    amount: number;

    @Column({type: 'decimal'})
    balanceAfter: number;

    @CreateDateColumn()
    createdAt: Date;
}