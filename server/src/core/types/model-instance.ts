import { Model, ModelCtor, Optional } from "sequelize";

export type ModelInstance<TData extends Record<string, any>,
    TCreationOptionalAttributes extends keyof TData = "id",
    TRelations extends Record<string, any> = {}
> = ModelCtor<
    Model<
        TData,
        Optional<
            TData & TRelations,
            TCreationOptionalAttributes | keyof TRelations
            >
    > & TData & TRelations
>;
