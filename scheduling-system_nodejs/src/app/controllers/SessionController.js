import res from 'express/lib/response'
import jwt from 'jsonwebtoken'
import * as Yup from 'yup'

import User from '../models/User'
import authConfig from '../../config/auth'

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation failure' })
    }

    const { email, password } = req.body

    const user = await User.findOne({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({
        error: 'User not found'
      })
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Invalid Password' })
    }

    const { id, name } = user

    console.log(authConfig.secret)

    return res.json({
      user: {
        id,
        name,
        email
      },
      // It was used the website MD5 Hash Generator to create a hash to CamIgor
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    })
  }
}
export default new SessionController()
