import { Participant, User } from "@core";
import { Database } from "@db";
import { DataTypes } from "sequelize";
import { Team } from "./types";

Team.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    slug: { type: DataTypes.STRING, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: true },
    avatar: { type: DataTypes.STRING, allowNull: true },
}, {
    modelName: "team",
    sequelize: Database
} );

Team.belongsTo( User, { as: "capitan" } );
Team.belongsToMany( User, { as: "players", through: "team_request" } );
Team.hasOne( Participant );

export { Team };
