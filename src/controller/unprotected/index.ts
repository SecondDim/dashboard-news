import { Context, body, description, request, responses, summary, tagsAll } from 'koa-swagger-decorator'

import fs from 'fs'

@tagsAll(['General'])
export default class GeneralController {
  @request('get', '/')
  @summary('Welcome page')
  @description('A simple welcome message to verify the service is up and running.')
  public static async helloWorld (ctx: Context): Promise<void> {
    await new Promise<void>((resolve) => { resolve() })
    const f = fs.readFileSync('/home/bentsou/Project/analysis-news/dashboard/src/view/index.html')
    ctx.type = 'html'
    ctx.body = f.toString()
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
