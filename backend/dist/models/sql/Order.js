"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initOrderModel = void 0;
const sequelize_1 = require("sequelize");
class Order extends sequelize_1.Model {
}
const initOrderModel = (sequelize) => {
    Order.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        totalAmount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending',
        },
    }, {
        sequelize,
        tableName: 'orders',
    });
    return Order;
};
exports.initOrderModel = initOrderModel;
