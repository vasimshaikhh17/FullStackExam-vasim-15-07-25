import { Sequelize } from 'sequelize';
import { initUserModel } from './sql/User';
import { initOrderModel } from './sql/Order';
import { initOrderItemModel } from './sql/OrderItem';

// This is the function that initializes and associates models
const setupModels = (sequelize: Sequelize) => {
  const User = initUserModel(sequelize);
  const Order = initOrderModel(sequelize);
  const OrderItem = initOrderItemModel(sequelize);

  // Define all associations
  User.hasMany(Order, { foreignKey: 'userId' });
  Order.belongsTo(User, { foreignKey: 'userId' });

  Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

  // Return the models so they can be exported
  return { User, Order, OrderItem };
};

// We need to get the sequelize instance from our config to run the setup
import { sequelize } from '../config/db';

// Run the setup and export the initialized models
const { User, Order, OrderItem } = setupModels(sequelize);

export { User, Order, OrderItem };