import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface OrderAttributes {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
}
interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'status'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public userId!: number;
  public totalAmount!: number;
  public status!: string; 
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initOrderModel = (sequelize: Sequelize) => {
  Order.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', 
        key: 'id',
      },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
   status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending', 
    },
  }, {
    sequelize,
    tableName: 'orders',
  });

  return Order;
};