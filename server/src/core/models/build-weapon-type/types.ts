import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table( {
    tableName: "build_weapon_type"
} )
export class BuildWeaponType extends Model<InferAttributes<BuildWeaponType>, InferCreationAttributes<BuildWeaponType>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare title_RU?: string;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare title_EU?: string;
}
