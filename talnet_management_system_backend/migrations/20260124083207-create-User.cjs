'use strict';

module.exports= {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('uuid_generate_v4()'), primaryKey: true },
      role_id: {
        type: Sequelize.UUID,
        references: { model: 'roles', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      email: { type: Sequelize.STRING, allowNull: false },
      phone_number: { type: Sequelize.STRING, allowNull: false},
      password_hash: { type: Sequelize.STRING, allowNull: false },
      full_name: { type: Sequelize.STRING },
      primary_skill: { type: Sequelize.STRING },
      years_of_experience: { type: Sequelize.INTEGER },
      description: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()') },
       is_deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
  },
  async down(queryInterface) {
     await queryInterface.sequelize.query(`DROP INDEX IF EXISTS users_email_key;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS users_phone_number_key;`);
    await queryInterface.dropTable('users');
  },
};