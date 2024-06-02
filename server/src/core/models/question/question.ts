import { Database } from "@db";
import { DataTypes } from "sequelize";
import { Question } from "./types";

Question.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    question_RU: { type: DataTypes.STRING, allowNull: true },
    question_EU: { type: DataTypes.STRING, allowNull: true },

    answer_RU: { type: DataTypes.TEXT, allowNull: true },
    answer_EU: { type: DataTypes.TEXT, allowNull: true },
}, {
    freezeTableName: true,
    modelName: "questions",
    sequelize: Database
} );

export { Question };
