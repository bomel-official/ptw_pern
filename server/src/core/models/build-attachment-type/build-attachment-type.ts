import { Database } from "@db";
import { DataTypes } from "sequelize";
import { BuildAttachmentType } from "./types";

BuildAttachmentType.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title_RU: { type: DataTypes.STRING, allowNull: true },
        title_EU: { type: DataTypes.STRING, allowNull: true },
    }, {
        freezeTableName: true,
        modelName: "build_attachment_types",
        sequelize: Database,
    } );

export { BuildAttachmentType };
