import { Context, body, description, request, summary, tagsAll } from 'koa-swagger-decorator'

@tagsAll(['General'])
export default class GeneralController {
  @request('get', '/')
  @summary('Welcome page')
  @description('A simple welcome message to verify the service is up and running.')
  public static async helloWorld (ctx: Context): Promise<void> {
    await new Promise<void>((resolve) => { resolve() })
    ctx.body = 'Hello World!'
  }

  @request('post', '/')
  @summary('Welcome page')
  @description('A simple welcome message to verify the service is up and running.')
  @body({ message: { type: 'string', required: true, description: 'return string' } })
  public static async postHelloWorld (ctx: Context): Promise<void> {
    await new Promise<void>((resolve) => { resolve() })
    ctx.body = ctx.request.body
  }
}
