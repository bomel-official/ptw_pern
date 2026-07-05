import { baseApi } from "@/shared/api";
import { IQuestion, UpsertQuestionInput } from "../model/types";

interface ApiSuccess<T> {
    ok: true;
    data: T;
    message?: string;
}

export const questionApi = baseApi.injectEndpoints( {
    endpoints: ( build ) => ( {
        getQuestions: build.query<IQuestion[], void>( {
            query: () => ( { url: "question/get" } ),
            transformResponse: ( res: ApiSuccess<IQuestion[]> ) => res.data,
            providesTags: [ "Question" ],
        } ),

        upsertQuestion: build.mutation<
            { item: IQuestion; message?: string },
            UpsertQuestionInput
        >( {
            query: ( body ) => ( {
                url: "question/save-create",
                method: "POST",
                body: { ...body, id: body.id ? body.id : "" },
            } ),
            transformResponse: ( res: ApiSuccess<IQuestion> ) => ( {
                item: res.data,
                message: res.message,
            } ),
            invalidatesTags: [ "Question" ],
        } ),

        deleteQuestion: build.mutation<{ id: number; message?: string }, number>( {
            query: ( id ) => ( {
                url: "question/delete",
                method: "DELETE",
                body: { id },
            } ),
            transformResponse: ( res: ApiSuccess<{ id: number }> ) => ( {
                id: res.data.id,
                message: res.message,
            } ),
            invalidatesTags: [ "Question" ],
        } ),
    } ),
} );

export const {
    useGetQuestionsQuery,
    useUpsertQuestionMutation,
    useDeleteQuestionMutation,
} = questionApi;
