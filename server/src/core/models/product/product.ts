import { ProductCat } from "@core";
import { Database } from "@db";
import { DataTypes } from "sequelize";
import { Product } from "./types";

Product.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
}, {
    modelName: "product",
    sequelize: Database
} );

Product.belongsTo( ProductCat );

export { Product };
