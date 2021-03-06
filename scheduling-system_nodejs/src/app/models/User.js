import Sequelize, { Model } from 'sequelize'
import bcryptjs from 'bcryptjs'

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN
      },
      {
        sequelize
      }
    )
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcryptjs.hash(user.password, 10)
      }
    })
    return this
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'photo_id', as: 'photo' })
  }

  checkPassword(password) {
    return bcryptjs.compare(password, this.password_hash)
  }
}

export default User
