"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initOrderItemModel = void 0;
const sequelize_1 = require("sequelize");
// Define the model class
class OrderItem extends sequelize_1.Model {
}
// Export the initialization function - this is the key change
const initOrderItemModel = (sequelize) => {
    OrderItem.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        orderId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'orders', // Use the table name string 'orders'
                key: 'id',
            },
        },
        productId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        productName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        sequelize, // Use the sequelize instance passed into this function
        tableName: 'order_items',
        timestamps: false,
    });
    return OrderItem;
};
exports.initOrderItemModel = initOrderItemModel;
