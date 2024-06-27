import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../user";

@Table( {
    tableName: "friend_requests",
    freezeTableName: true
} )
export class FriendRequest extends Model<InferAttributes<FriendRequest>, InferCreationAttributes<FriendRequest>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @Column( {
        type: DataTypes.BOOLEAN, defaultValue: false
    } )
    declare isAccepted: CreationOptional<boolean>;

    @ForeignKey( () => User ) @Column( {
        type: DataTypes.INTEGER, allowNull: true
    } )
    declare userFromId: number;

    @BelongsTo( () => User, "userFromId" )
    declare user_from: NonAttribute<User>;

    @ForeignKey( () => User ) @Column( {
        type: DataTypes.INTEGER, allowNull: true
    } )
    declare userToId: number;

    @BelongsTo( () => User, "userToId" )
    declare user_to: NonAttribute<User>;
}
