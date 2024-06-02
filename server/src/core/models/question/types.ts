import {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";

export class Question
    extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
    declare id: CreationOptional<number>;

    declare question_RU?: CreationOptional<string>;
    declare question_EU?: CreationOptional<string>;
    declare answer_RU?: CreationOptional<string>;
    declare answer_EU?: CreationOptional<string>;
}
