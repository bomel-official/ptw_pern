import { CV, generateValidator, isError } from "@core";
import { UpsertQuestionDto } from "./question.dto";

/**
 * Validates the save/create question body. Throws ApiError (via the validator)
 * on invalid input so the async handler forwards it to the error middleware.
 */
export function validateUpsertQuestion( body: unknown ): UpsertQuestionDto {
    const src = body as Record<string, unknown>;
    const validated = generateValidator( () => ({
        id: new CV( src.id, { label: "id" } ).optional().number().val,
        question_EU: new CV( src.question_EU, { label: "question_EU" } ).string().val,
        question_RU: new CV( src.question_RU, { label: "question_RU" } ).string().val,
        answer_RU: new CV( src.answer_RU, { label: "answer_RU" } ).string().val,
        answer_EU: new CV( src.answer_EU, { label: "answer_EU" } ).string().val,
    }) );
    if ( isError( validated ) ) {
        throw validated.errorObject;
    }
    return validated.data as UpsertQuestionDto;
}
