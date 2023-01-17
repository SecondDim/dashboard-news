import { SwaggerRouter } from 'koa-swagger-decorator'
import path from 'path'

/**
 * protectedRouter
 */
const protectedRouter = new SwaggerRouter()

// Swagger endpoint
protectedRouter.swagger({
  title: 'protected api',
  description: '',
  version: '0.0.1',
})

// mapDir will scan the input dir, and automatically call router.map to all Router Class
protectedRouter.mapDir(path.join(__dirname, 'controller', 'protected'))

/**
 * unprotectedRouter
 */

const unprotectedRouter = new SwaggerRouter()

// Swagger endpoint
unprotectedRouter.swagger({
  title: 'unprotected api',
  description: '',
  version: '0.0.1',
})

// mapDir will scan the input dir, and automatically call router.map to all Router Class
unprotectedRouter.mapDir(path.join(__dirname, 'controller', 'unprotected'))

export { protectedRouter, unprotectedRouter }
