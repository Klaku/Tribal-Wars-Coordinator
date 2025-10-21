import { formatDateTime } from './helpers'

class CustomLogger {
  constructor() {}

  private FormatLog(level: 'Info' | 'Debug' | 'Warn' | 'Error') {
    return `${`[${formatDateTime()}]`.padEnd(25, ' ')} ${level.padEnd(
      10,
      ' '
    )} `
  }
  public Info(message: string) {
    console.log(`${this.FormatLog('Info')} ${message}`)
  }
  public Debug(message: string) {
    console.log(`${this.FormatLog('Debug')} ${message}`)
  }
  public Warning(message: string) {
    console.log(`${this.FormatLog('Warn')} ${message}`)
  }
  public Error(message: string, error: Error) {
    console.log(
      `${this.FormatLog('Error')} ${message}`,
      error.name,
      error.message,
      error.stack
    )
  }
}

export const logger = new CustomLogger()
