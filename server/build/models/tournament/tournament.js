"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tournament = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../../db");
exports.Tournament = db_1.Database.define('tournament', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title_RU: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    title_EU: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    slug: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    game: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    type: { type: sequelize_1.DataTypes.STRING, defaultValue: 'tournament' },
    isRegisterOn: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: true },
    twitchChannel: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    dateBegin: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    dateEnd: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    previewImg: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    maxUsers: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    playersInTeam: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    participationPrice: { type: sequelize_1.DataTypes.FLOAT, defaultValue: 0 },
    prizes: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    prize_1: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    prize_2: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    prize_3: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    descRules_RU: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    descRules_EU: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    descAdditional_RU: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    descAdditional_EU: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    format_RU: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    format_EU: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    participantsList: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER), defaultValue: [] }
    // participants: User(Many)   ------------------ done
});
