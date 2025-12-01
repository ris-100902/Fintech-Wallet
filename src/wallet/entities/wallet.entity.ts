import { User } from "src/users/entities/user.entity";
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('wallet')
export class Wallet {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.wallet, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;
}
