import { InferAttributes, InferCreationAttributes, Model } from "sequelize";

export class Product
    extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
    declare id: number;
    declare title: string;
    declare slug: string;
    declare price: number;
    declare description?: string;
}
