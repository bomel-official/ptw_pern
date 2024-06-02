import { Database } from "@db";
import { DataTypes } from "sequelize";
import { ParticipantUser } from "./types";

ParticipantUser.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, {
    freezeTableName: true,
    modelName: "participant_users",
    sequelize: Database
} );

export { ParticipantUser };
