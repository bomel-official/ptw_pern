import { Database } from "@db";
import { DataTypes } from "sequelize";
import { ProductCat } from "./types";

ProductCat.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false }
}, {
    freezeTableName: true,
    modelName: "product_cats",
    sequelize: Database
} );

export { ProductCat };
