import { Participant } from "@core";
import { Database } from "@db";
import { DataTypes } from "sequelize";
import { ParticipantRequest } from "./types";

ParticipantRequest.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    dataArray: {
        type: DataTypes.ARRAY( DataTypes.ARRAY( DataTypes.FLOAT ) ),
        defaultValue: [ [] ]
    },
    places: {
        type: DataTypes.ARRAY( DataTypes.ARRAY( DataTypes.FLOAT ) ),
        defaultValue: []
    },
    approveUrl: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "new" },
}, {
    modelName: "participant_request",
    sequelize: Database
} );

ParticipantRequest.belongsTo( Participant );

export { ParticipantRequest };
