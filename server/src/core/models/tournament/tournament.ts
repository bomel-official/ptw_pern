import { TournamentType } from "@constants";
import { Participant, User } from "@core";
import { Database } from "@db";
import { DataTypes } from "sequelize";
import { Tournament } from "./types";

Tournament.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title_RU: { type: DataTypes.STRING, allowNull: false },
    title_EU: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false },
    game: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, defaultValue: TournamentType.TOURNAMENT },
    isRegisterOn: { type: DataTypes.BOOLEAN, defaultValue: true },
    twitchChannel: { type: DataTypes.STRING, allowNull: false },
    dateBegin: { type: DataTypes.DATE, allowNull: false },
    dateEnd: { type: DataTypes.DATE, allowNull: false },
    previewImg: { type: DataTypes.STRING, allowNull: true },
    maxUsers: { type: DataTypes.INTEGER, allowNull: false },
    playersInTeam: { type: DataTypes.INTEGER, allowNull: false },
    participationPrice: { type: DataTypes.FLOAT, defaultValue: 0 },
    prizes: { type: DataTypes.INTEGER, allowNull: false },
    prize_1: { type: DataTypes.INTEGER, allowNull: false },
    prize_2: { type: DataTypes.INTEGER, allowNull: false },
    prize_3: { type: DataTypes.INTEGER, allowNull: false },

    descRules_RU: { type: DataTypes.TEXT, allowNull: false },
    descRules_EU: { type: DataTypes.TEXT, allowNull: false },
    descAdditional_RU: { type: DataTypes.TEXT, allowNull: false },
    descAdditional_EU: { type: DataTypes.TEXT, allowNull: false },
    format_RU: { type: DataTypes.STRING, allowNull: false },
    format_EU: { type: DataTypes.STRING, allowNull: false },

    participantsList: {
        type: DataTypes.ARRAY( DataTypes.INTEGER ), defaultValue: []
    }
}, {
    modelName: "tournament",
    sequelize: Database
} );

Tournament.hasMany( Participant, { as: "participants" } );
Tournament.belongsToMany( User, { as: "players", through: "tournament_user" } );

export { Tournament };
