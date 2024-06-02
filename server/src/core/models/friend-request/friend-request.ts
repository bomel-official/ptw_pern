import { User } from "@core";
import { Database } from "@db";
import { DataTypes } from "sequelize";
import { FriendRequest } from "./types";

FriendRequest.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    isAccepted: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    modelName: "friend_request",
    sequelize: Database
} );

FriendRequest.belongsTo( User, { as: "user_to" } );
FriendRequest.belongsTo( User, { as: "user_from" } );

export { FriendRequest };
