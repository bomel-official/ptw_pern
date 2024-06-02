import { Database } from "@db";
import { DataTypes } from "sequelize";
import { FriendRequest } from "./types";

FriendRequest.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    isAccepted: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    freezeTableName: true,
    modelName: "friend_requests",
    sequelize: Database
} );

export { FriendRequest };
