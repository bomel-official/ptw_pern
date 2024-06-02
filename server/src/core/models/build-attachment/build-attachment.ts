import { BuildAttachmentType } from "@core";
import { Database } from "@db";
import { DataTypes } from "sequelize";
import { BuildAttachment } from "./types";

BuildAttachment.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    gameVersion: { type: DataTypes.STRING, allowNull: true },
    title_RU: { type: DataTypes.STRING, allowNull: true },
    title_EU: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
}, {
    modelName: "build_attachment",
    sequelize: Database
} );

BuildAttachment.belongsTo( BuildAttachmentType );

export { BuildAttachment };
