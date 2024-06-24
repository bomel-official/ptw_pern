import { Game } from "@constants";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { BuildWeaponType } from "../build-weapon-type";

@Table( {
    tableName: "build_weapon"
} )
export class BuildWeapon extends Model<InferAttributes<BuildWeapon>, InferCreationAttributes<BuildWeapon>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare gameVersion?: CreationOptional<Game>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare image?: CreationOptional<string>;

    @Column( {
        type: DataTypes.ARRAY( DataTypes.INTEGER ), defaultValue: []
    } )
    declare allowedAttachments: CreationOptional<number[]>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare title_RU?: string;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare title_EU?: string;

    @ForeignKey( () => BuildWeaponType ) @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare buildWeaponTypeId: number;

    @BelongsTo( () => BuildWeaponType )
    declare buildWeaponType: NonAttribute<BuildWeaponType>;
}
