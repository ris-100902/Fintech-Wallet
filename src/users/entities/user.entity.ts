import { Wallet } from "src/wallet/entities/wallet.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('users')
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToOne(() => Wallet, (wallet) => wallet.user)
    wallet: Wallet;
}