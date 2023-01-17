import { Logger, createLogger, format, transports } from 'winston'

import { Context } from 'koa'
import config from '../config'

const tzOffset = 8 // +8
const tzOffsetMilliseconds = -1 * tzOffset * 60 * 60 * 1000 // -28800000 // new Date().getTimezoneOffset() * 60000
const tzOffsetString = tzOffset < 0 ? `-${(0 - tzOffset).toString().padStart(2, '0')}` : `+${tzOffset.toString().padStart(2, '0')}`

const transportsConsole = new transports.Console({ stderrLevels: ['debug', 'warn', 'error'] })

const defaultLoggerConfig = {
  level: config.isSillyMode ? 'silly' : 'debug',
  silent: config.isTestMode,
  format: format.combine(
    format.splat(),
    format.timestamp({
      format: () => {
        return new Date(Date.now() - tzOffsetMilliseconds).toISOString().slice(0, -1).concat(tzOffsetString)
      },
    }),
    format.colorize(),
    format.printf(
      info => {
        return `${info.timestamp} - ${info.level}: ${info.message}`
      },
    ),
  ),
  transports: [transportsConsole],
}

const devLoggerConfig = {
  ...defaultLoggerConfig,
}

const prodLoggerConfig = {
  ...defaultLoggerConfig,
  level: 'info',
}

const logger = createLogger(
  config.isDevMode
    ? devLoggerConfig
    : prodLoggerConfig,
)

const logWithKao = (): any => {
  return async (ctx: Context, next: () => Promise<any>): Promise<void> => {
    const start = new Date().getTime()

    await next()

    const ms = new Date().getTime() - start

    let logLevel: string
    if (ctx.status >= 500) {
      logLevel = 'error'
    } else if (ctx.status >= 400) {
      logLevel = 'warn'
    } else {
      logLevel = 'info'
    }

    const msg = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`

    logger.log(logLevel, msg)
  }
}

const loggerToFile = (fileNameWithPath: string = `${Date.now().toString()}.log`, onlyToFile: boolean = true): Logger => {
  const transportsFileConfig = new transports.File({ filename: fileNameWithPath, maxsize: 10 * 1024 * 1024 /** 10 MB */ })
  logger.add(transportsFileConfig)
  if (onlyToFile) {
    logger.remove(transportsConsole)
  }
  return logger
}

export { logger, logWithKao, loggerToFile }
