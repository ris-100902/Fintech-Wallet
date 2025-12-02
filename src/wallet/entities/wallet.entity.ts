import { Ledger } from "src/ledger/entities/ledger.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('wallet')
export class Wallet {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.wallet, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;

    @OneToMany(() => Ledger, (ledger) => ledger.wallet)
    ledger: Ledger[];

    @Column({type: 'decimal', default: 0})
    balance: number;
}
