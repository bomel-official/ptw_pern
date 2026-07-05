import { Question, QuestionRepository } from "@core";
import { ApiError } from "@error";
import { UpsertQuestionDto } from "./question.dto";

export const questionService = {
    getAll(): Promise<Question[]> {
        return QuestionRepository.findAll();
    },

    async upsert( dto: UpsertQuestionDto ): Promise<{ item: Question; created: boolean }> {
        const { id, question_RU, question_EU, answer_RU, answer_EU } = dto;

        if ( id ) {
            const item = await QuestionRepository.findByPk( id );
            if ( !item ) {
                throw ApiError.badRequest( "Запись не найдена" );
            }
            item.set( { question_EU, question_RU, answer_EU, answer_RU } );
            await item.save();
            return { item, created: false };
        }

        const item = await QuestionRepository.create( {
            question_RU, question_EU, answer_RU, answer_EU,
        } );
        return { item, created: true };
    },

    async remove( id: number ): Promise<void> {
        const item = await QuestionRepository.findByPk( id );
        if ( !item ) {
            throw ApiError.badRequest( "Запись не найдена" );
        }
        await item.destroy();
    },
};
