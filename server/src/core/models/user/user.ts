import { Device, Platform, UserRole } from "@constants";
import { Database } from "@db";
import { DataTypes } from "sequelize";
import { User } from "./types";

User.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nickname: { type: DataTypes.STRING, allowNull: true, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING, defaultValue: "password" },
    role: { type: DataTypes.STRING, defaultValue: UserRole.USER },
    status: { type: DataTypes.STRING, defaultValue: "FREE" },
    avatar: { type: DataTypes.STRING, allowNull: true },

    twitch: { type: DataTypes.STRING, allowNull: true },
    twitter: { type: DataTypes.STRING, allowNull: true },
    steam: { type: DataTypes.STRING, allowNull: true },
    vk: { type: DataTypes.STRING, allowNull: true },
    youtube: { type: DataTypes.STRING, allowNull: true },
    activisionId: { type: DataTypes.STRING, allowNull: true },

    discord_id: { type: DataTypes.STRING, allowNull: true },
    discord_username: { type: DataTypes.STRING, allowNull: true },
    discord_avatar: { type: DataTypes.STRING, allowNull: true },

    friends: { type: DataTypes.ARRAY( DataTypes.INTEGER ), defaultValue: [] },
    platform: { type: DataTypes.STRING, defaultValue: Platform.PC },
    device: { type: DataTypes.STRING, defaultValue: Device.KEYBOARD_MOUSE },

    statsToursPlayed: { type: DataTypes.INTEGER, defaultValue: 0 },
    statsToursList: {
        type: DataTypes.ARRAY( DataTypes.INTEGER ), defaultValue: []
    },
    statsToursWon: { type: DataTypes.INTEGER, defaultValue: 0 },
    statsToursTop3: { type: DataTypes.INTEGER, defaultValue: 0 },
    statsAverageKills: { type: DataTypes.FLOAT, defaultValue: 0 },
    statsAmountKills: { type: DataTypes.FLOAT, defaultValue: 0 },
}, {
    freezeTableName: true,
    tableName: "users",
    sequelize: Database
} );

export { User };
