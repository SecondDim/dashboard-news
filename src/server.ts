import { logWithKao, logger } from './utils/logger'
import { protectedRouter, unprotectedRouter } from './routes'

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import config from './config'
import { cron } from './cron'
import { errorHandlerWithKao } from './utils/error'
import favicon from 'koa-favicon'
import jwt from 'koa-jwt'
import mount from 'koa-mount'
import path from 'path'
import serve from 'koa-static'

const app = new Koa()

// Logger middleware -> use winston as logger (logging.ts with config)
app.use(logWithKao())

// Enable bodyParser with default options
app.use(bodyParser())

//
app.use(errorHandlerWithKao())

// static serve
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')))
app.use(mount('/static', serve('static', { maxage: 0 })))

// These routes are protected by the ~~JWT~~ middleware, also include middleware to respond with "Method Not Allowed - 405".
app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods())

// Middleware below this line is only reached if JWT token is valid
app.use(jwt({ secret: 'shared-secret' }))

//
app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods())

// Register cron job to do any action needed
cron.start()

app.listen(config.server.port)

// /etc/letsencrypt/live/line-bot.cathaybc.com:/home/node/ssl
//  https.createServer({
//  key: fs.readFileSync('/home/node/ssl/privkey.pem'),
//  cert: fs.readFileSync('/home/node/ssl/fullchain.pem'),
//  }, app.callback())
//  .listen(config.server.port)

logger.info(`Server running on port ${config.server.port}`)
