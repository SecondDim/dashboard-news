/**
 * ES6 sleep function
 * @param ms millisecond of process sleep
 * @returns Promise<setTimeout(resolve, ms)>
 */
export const sleep = async (ms: number): Promise<void> => { await new Promise(resolve => setTimeout(resolve, ms)) }

/**
 *
 * @param string
 * @returns
 *  True mean input is json string which can parse by JSON.
 *  False mean input is not json string
 */
export const isJsonString = (string: string): boolean => {
  try {
    JSON.parse(string)
  } catch (error) {
    return false
  }
  return true
}
