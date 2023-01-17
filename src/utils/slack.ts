import axios, { AxiosResponse } from 'axios'

import { logger } from './logger'

export class Slack {
  private readonly apiUrl: undefined | string
  private readonly proxy: false | { protocol: string, host: string, port: number }
  private readonly axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  constructor (apiUrl: string, proxy?: { protocol: string, host: string, port: number }) {
    this.proxy = proxy ?? false
    this.apiUrl = apiUrl
  }

  private async axiosRequest (payload: { 'text': string }): Promise<AxiosResponse<any>> {
    if (this.apiUrl === undefined) {
      throw new TypeError('axios request fail: variables apiUrl undefined')
    }
    const axiosConfig = (() => {
      if (this.proxy === false) {
        return { ...this.axiosConfig }
      } else {
        return { proxy: { ...this.proxy }, ...this.axiosConfig }
      }
    })()

    try {
      return await axios.post(this.apiUrl, payload, axiosConfig)
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && (error.response !== undefined)) {
        logger.error(`${error.name}: ${error.response.data}`)
      } else {
        logger.error(error)
      }
      throw error
    }
  }

  /**
   * sendMessage
   */
  public async sendMessage (msg: string): Promise<boolean> {
    const res = await this.axiosRequest({ text: msg })
    return res.status === 200
  }
}
