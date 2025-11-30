import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User)
    private usersRepository: Repository<User>,
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneByEmail(email: string): Promise<User| null> {
    return this.usersRepository.findOneBy({email});
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({id});
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.usersRepository.update(id, updateUserDto);
    return await this.usersRepository.findOneBy({id});
  }

  async remove(id: number): Promise<User| null> {
    const user = await this.usersRepository.findOneBy({id});
    await this.usersRepository.delete(id);
    return user;
  }
}
