import * as _ from 'lodash'
import { resolve } from 'path'

import productionConfig from './prod.config'

export const isProd = process.env.NODE_ENV === 'production'

let config = {
  port: 3003,
  hostName: '0.0.0.0',

  orm: {
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    username: 'root',
    password: '123456',
    database: 'blog',
    entities: [resolve(`./**/*.entity${isProd ? '.js' : '.ts'}`)],
    migrations: ['migration/*.ts'],
    timezone: 'UTC',
    charset: 'utf8mb4',
    multipleStatements: true,
    dropSchema: false,
    synchronize: true,
    logging: true,
  },

  jwt: {
    secret: 'secretKey',
    signOptions: {
      expiresIn: 60 * 60 * 24 * 30,
    },
  },
}

if (isProd) {
  config = _.merge(config, productionConfig)
}

export { config }
export default config