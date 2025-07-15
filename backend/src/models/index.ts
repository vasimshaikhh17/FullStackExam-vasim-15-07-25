import { Sequelize } from 'sequelize';
import { initUserModel } from './sql/User';
import { initOrderModel } from './sql/Order';
import { initOrderItemModel } from './sql/OrderItem';

const setupModels = (sequelize: Sequelize) => {
  const User = initUserModel(sequelize);
  const Order = initOrderModel(sequelize);
  const OrderItem = initOrderItemModel(sequelize);

  User.hasMany(Order, { foreignKey: 'userId' });
  Order.belongsTo(User, { foreignKey: 'userId' });

  Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

  return { User, Order, OrderItem };
};

import { sequelize } from '../config/db';

const { User, Order, OrderItem } = setupModels(sequelize);

export { User, Order, OrderItem };