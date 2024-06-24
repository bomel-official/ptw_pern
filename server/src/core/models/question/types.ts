import {
    CreationOptional, DataTypes,
    InferAttributes,
    InferCreationAttributes
} from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table( {
    tableName: "question"
} )
export class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare question_RU?: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare question_EU?: CreationOptional<string>;

    @Column( {
        type: DataTypes.TEXT, allowNull: true
    } )
    declare answer_RU?: CreationOptional<string>;

    @Column( {
        type: DataTypes.TEXT, allowNull: true
    } )
    declare answer_EU?: CreationOptional<string>;
}
