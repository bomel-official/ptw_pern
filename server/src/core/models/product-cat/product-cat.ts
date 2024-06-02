import { Product } from "@core";
import { Database } from "@db";
import { DataTypes } from "sequelize";
import { ProductCat } from "./types";

ProductCat.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false }
}, {
    modelName: "product_cat",
    sequelize: Database
} );

ProductCat.hasMany( Product );

export { ProductCat };
