import { Database } from "@db";
import { DataTypes } from "sequelize";
import { ParticipantUser } from "./types";

ParticipantUser.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, {
    modelName: "participant_user",
    sequelize: Database
} );

export { ParticipantUser };
