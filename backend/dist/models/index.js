"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = exports.Order = exports.User = void 0;
const User_1 = require("./sql/User");
const Order_1 = require("./sql/Order");
const OrderItem_1 = require("./sql/OrderItem");
// This is the function that initializes and associates models
const setupModels = (sequelize) => {
    const User = (0, User_1.initUserModel)(sequelize);
    const Order = (0, Order_1.initOrderModel)(sequelize);
    const OrderItem = (0, OrderItem_1.initOrderItemModel)(sequelize);
    // Define all associations
    User.hasMany(Order, { foreignKey: 'userId' });
    Order.belongsTo(User, { foreignKey: 'userId' });
    Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
    OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
    // Return the models so they can be exported
    return { User, Order, OrderItem };
};
// We need to get the sequelize instance from our config to run the setup
const db_1 = require("../config/db");
// Run the setup and export the initialized models
const { User, Order, OrderItem } = setupModels(db_1.sequelize);
exports.User = User;
exports.Order = Order;
exports.OrderItem = OrderItem;
