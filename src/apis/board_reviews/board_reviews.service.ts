import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardReview } from './entities/board_review.entity';
import {
  IBoardReviewsServiceCreate,
  IBoardReviewsServiceFindAllById,
  IBoardReviewsServiceUpdate,
} from './interfaces/board_reviews-service.interface';

@Injectable()
export class BoardReviewsService {
  constructor(
    @InjectRepository(BoardReview)
    private readonly boardReviewsRepository: Repository<BoardReview>, //
  ) {}

  findAllById({ board_id }: IBoardReviewsServiceFindAllById) {
    return this.boardReviewsRepository.find({
      where: { board_: { board_id } },
      relations: ['user_', 'board_'],
    });
  }

  async create({
    user_id,
    createBoardReviewInput,
  }: IBoardReviewsServiceCreate): Promise<string> {
    const board_id = createBoardReviewInput.board_id;
    const result = await this.boardReviewsRepository.save({
      board_: { board_id },
      user_: { user_id },
      ...createBoardReviewInput,
    });

    return result.br_id;
  }

  async update({ updateBoardReviewInput }: IBoardReviewsServiceUpdate) {
    const br_id = updateBoardReviewInput.br_id;

    const result = await this.boardReviewsRepository.update(
      { br_id },
      { ...updateBoardReviewInput },
    );

    return result.affected ? true : false;
  }

  async delete({ br_id }): Promise<boolean> {
    const result = await this.boardReviewsRepository.softDelete({ br_id });

    return result.affected ? true : false;
  }
}
