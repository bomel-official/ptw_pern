import { Invoice, ParticipantRequest, Team, Tournament, User } from "@core";
import { Database } from "@db";
import { DataTypes } from "sequelize";
import { Participant } from "./types";

Participant.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    points: { type: DataTypes.FLOAT, defaultValue: 0 },
    dataArray: {
        type: DataTypes.ARRAY( DataTypes.ARRAY( DataTypes.FLOAT ) ),
        defaultValue: [ [] ]
    },
    places: {
        type: DataTypes.ARRAY( DataTypes.ARRAY( DataTypes.FLOAT ) ),
        defaultValue: []
    },
    isRoundsHidden: {
        type: DataTypes.ARRAY( DataTypes.BOOLEAN ), defaultValue: []
    },
    roomNumber: { type: DataTypes.INTEGER, defaultValue: 0 },
    invoiceUrl: { type: DataTypes.STRING, allowNull: true },
    payMethod: { type: DataTypes.STRING, defaultValue: "paypal" },
    isPaid: { type: DataTypes.BOOLEAN, defaultValue: false },
    priority: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
    modelName: "participant",
    sequelize: Database
} );

Participant.belongsToMany( User, { through: "participant_user" } );
Participant.belongsTo( Team );
Participant.belongsTo( Tournament );
Participant.hasOne( ParticipantRequest );
Participant.belongsTo( Invoice );

export { Participant };
