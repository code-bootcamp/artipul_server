import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';

@Injectable()
export class HistorySerive {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async findAll(userId, page) {
    return await this.historyRepository.find({
      take: 10,
      skip: 10 * (page - 1),
      where: { user: userId },
    });
  }
}
