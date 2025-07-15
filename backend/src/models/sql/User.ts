import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

// The rest of your interfaces remain the same
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Your class definition remains the same
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public passwordHash!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}

// Export a function that takes the sequelize instance
export const initUserModel = (sequelize: Sequelize) => {
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize, // Use the instance passed to the function
    tableName: 'users',
    hooks: {
      async beforeCreate(user: User) {
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
      },
    }
  });

  return User;
};