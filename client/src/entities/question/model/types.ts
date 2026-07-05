export interface IQuestion {
    id: number;
    question_RU: string;
    question_EU: string;
    answer_RU: string;
    answer_EU: string;
}

export interface UpsertQuestionInput {
    id?: number | null;
    question_RU: string;
    question_EU: string;
    answer_RU: string;
    answer_EU: string;
}
