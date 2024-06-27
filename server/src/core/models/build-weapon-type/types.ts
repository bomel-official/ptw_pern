import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { Column, HasMany, Model, Table } from "sequelize-typescript";
import { Build } from "../build";

@Table( {
    tableName: "build_weapon_types",
    freezeTableName: true
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

    @HasMany( () => Build, { foreignKey: "buildWeaponTypeId" } )
    declare builds: NonAttribute<Build[]>;
}
