import { Database } from "@db";
import { DataTypes } from "sequelize";
import { Build } from "./types";

Build.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: true },
    gameVersion: { type: DataTypes.STRING, allowNull: true },
    attachments: {
        type: DataTypes.ARRAY( DataTypes.ARRAY( DataTypes.FLOAT ) ),
        defaultValue: []
    },
    likes: { type: DataTypes.ARRAY( DataTypes.INTEGER ), defaultValue: [] },
    likesCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    isMeta: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    freezeTableName: true,
    modelName: "builds",
    sequelize: Database
} );

export { Build };
