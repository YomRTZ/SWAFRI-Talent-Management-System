import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { models } from '../models/index.js';
import sequelize from '../config/database.js';

export const seedAdmin = async () => {
  await sequelize.authenticate();

  // Ensure admin role exists
  let adminRole = await models.Role.findOne({ where: { role_name: 'admin' } });
  if (!adminRole) {
    console.log("Admin role not found. Please run role seeder first.");
    return;
  }

  const email = 'admin@gmail.com';
  const tempPassword = 'admin123'; 
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const existingAdmin = await models.User.findOne({ where: { email } });
  if (!existingAdmin) {
    await models.User.create({
      email,
     password_hash: hashedPassword,
      full_name: 'Admin User',
      phone_number: '1234567890',
      role_id: adminRole.id
    });

    console.log('========================================');
    console.log('Admin created successfully!');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin123');
    console.log('========================================');
  } else {
    console.log('Admin already exists.');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin123');
  }
};
