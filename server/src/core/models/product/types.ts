import { DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table( {
    tableName: "product"
} )
export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: number;

    @Column( {
        type: DataTypes.STRING, allowNull: false
    } )
    declare title: string;

    @Column( {
        type: DataTypes.STRING, allowNull: false
    } )
    declare slug: string;

    @Column( {
        type: DataTypes.FLOAT, allowNull: false
    } )
    declare price: number;

    @Column( {
        type: DataTypes.TEXT, allowNull: true
    } )
    declare description?: string;
}
