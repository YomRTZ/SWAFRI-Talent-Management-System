import sequelize from '../config/database.js'
import { seedRoles } from './seed-roles.js'
import { seedAdmin } from './seed-admin.js'
const runSeeds = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected')

    await seedRoles()
    await seedAdmin()

    console.log('All seeds completed successfully')
    process.exit(0)
  } catch (err) {
    console.error('Seeding failed')
    console.error(err)
    process.exit(1)
  }
}

runSeeds()
