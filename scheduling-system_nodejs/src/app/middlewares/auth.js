import jwt from 'jsonwebtoken'
import { promisify } from 'util'

import authConfig from '../../config/auth'

export default async (req, res, next) => {
  const authHeaders = req.headers.authorization

  if (!authHeaders) {
    return res.status(401).json({
      message: 'To access this service, you must be logged in.'
    })
  }

  const [, token] = authHeaders.split(' ')

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)
    req.userId = decoded.id
    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid Token'
    })
  }
}
