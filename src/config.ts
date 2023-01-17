/* eslint-disable no-unused-vars */

import dotenv from 'dotenv'

dotenv.config()

/**
 * @requires development - 開發環境
 * @requires testing - 測試環境
 * @requires production - 正式環境
 */
export enum EnvironmentEnum {
  development = 'development',
  testing = 'testing',
  production = 'production',
}

export interface Config {
  environment: EnvironmentEnum
  isDevMode: boolean
  isTestMode: boolean
  isSillyMode: boolean
  redis: {
    port: number
    host: string
    db: number
  }
  redisMaxQueueLength: number
  server: {
    host: string
    port: number
  }
  slackWebhookUrl: {
    ch50: string
    ch51: string
    debug: string
  }
}

const environment = (() => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return EnvironmentEnum.development
    case 'testing':
      return EnvironmentEnum.testing
    default:
      return EnvironmentEnum.production
  }
})()

const isDevMode = environment === EnvironmentEnum.development
const isTestMode = environment === EnvironmentEnum.testing

const config: Config = {
  environment,
  isDevMode,
  isTestMode,
  isSillyMode: (process.env.LOGGER_SILLY?.toLowerCase() === 'true') || false,
  redis: {
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    db: parseInt(process.env.REDIS_DB ?? '0'),
  },
  redisMaxQueueLength: parseInt(process.env.REDIS_MAX_QUEUE_LENGTH ?? '1024'),
  server: {
    host: process.env.SERVER_HOST ?? '127.0.0.1',
    port: parseInt(process.env.SERVER_PORT ?? '1987'),
  },
  slackWebhookUrl: {
    ch50: process.env.SLACK_50_WEBHOOK_URL ?? '',
    ch51: process.env.SLACK_51_WEBHOOK_URL ?? '',
    debug: process.env.SLACK_DE_WEBHOOK_URL ?? '',
  },

}

export default config
