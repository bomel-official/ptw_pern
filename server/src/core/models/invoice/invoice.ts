import { Participant } from "@core";
import { Database } from "@db";
import { DataTypes } from "sequelize";
import { Invoice } from "./types";

Invoice.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    enotId: { type: DataTypes.STRING, allowNull: true },
    url: { type: DataTypes.STRING, allowNull: true },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    currency: { type: DataTypes.STRING, defaultValue: "EUR" },
    status: { type: DataTypes.STRING, defaultValue: "created" },
    expired: { type: DataTypes.DATE, allowNull: true }
}, {
    modelName: "invoice",
    sequelize: Database
} );

Invoice.belongsTo( Participant );

export { Invoice };
