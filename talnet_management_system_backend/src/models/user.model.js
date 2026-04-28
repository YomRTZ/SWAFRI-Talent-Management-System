

import  sequelize  from '../config/database.js';
import { DataTypes } from 'sequelize';

export const User = sequelize.define('User', {
   id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  role_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  
  email: { type: DataTypes.STRING, unique: true },
  phone_number: { type: DataTypes.STRING, unique: true },
  password_hash: DataTypes.STRING,
  full_name: DataTypes.STRING,
  primary_skill: DataTypes.STRING,
  years_of_experience: DataTypes.INTEGER,
  description: DataTypes.STRING,
   is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
   deleted_at: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'users', timestamps: true });
