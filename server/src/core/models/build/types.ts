import { Game } from "@constants";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { BuildWeapon } from "../build-weapon";
import { BuildWeaponType } from "../build-weapon-type";
import { User } from "../user";

@Table( {
    tableName: "build"
} )
export class Build extends Model<InferAttributes<Build>, InferCreationAttributes<Build>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare title?: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare gameVersion?: CreationOptional<Game>;

    @Column( {
        type: DataTypes.ARRAY( DataTypes.ARRAY( DataTypes.FLOAT ) ),
        defaultValue: []
    } )
    declare attachments: CreationOptional<number[][]>;

    @Column( {
        type: DataTypes.ARRAY( DataTypes.INTEGER ), defaultValue: []
    } )
    declare likes: CreationOptional<number[]>;

    @Column( {
        type: DataTypes.INTEGER, defaultValue: 0
    } )
    declare likesCount: CreationOptional<number>;

    @Column( {
        type: DataTypes.BOOLEAN, defaultValue: false
    } )
    declare isMeta: CreationOptional<boolean>;

    @ForeignKey( () => User ) @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare userId: number;

    @BelongsTo( () => User )
    declare user: NonAttribute<User>;

    @ForeignKey( () => BuildWeaponType ) @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare buildWeaponTypeId: number;

    @BelongsTo( () => BuildWeaponType )
    declare buildWeaponType: NonAttribute<BuildWeaponType>;

    @ForeignKey( () => BuildWeapon ) @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare buildWeaponId: number;

    @BelongsTo( () => BuildWeapon )
    declare buildWeapon: NonAttribute<BuildWeapon>;
}
