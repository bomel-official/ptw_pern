import { DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table( {
    tableName: "product_cat"
} )
export class ProductCat extends Model<InferAttributes<ProductCat>, InferCreationAttributes<ProductCat>> {

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
}
