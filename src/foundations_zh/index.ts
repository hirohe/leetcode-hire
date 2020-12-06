interface ErrorMessage {
  message: string
  stack: Array<{
    line: number
    column: number
    filename: string
  }>
}

const ChromeErrorStackLineRegex = /^at\s(.*\s)?(.*):(\d+):(\d+)$/
const FirefoxErrorStackLineRegex = /@?([^@]*):(\d+):(\d+)$/

export function serializeErrorStack(stackString: string): ErrorMessage | null {
  if (stackString) {
    const [firstLine, ...restLines] = stackString.split('\n')

    let message = ''
    if (firstLine.indexOf(': ') !== -1) {
      message = firstLine.split(': ')[1]
    }

    const stack = restLines
      .map((lineText) => {
        const lineTextTrim = lineText.trim()
        if (lineTextTrim.startsWith('at')) {
          // Chrome error
          const result = ChromeErrorStackLineRegex.exec(lineTextTrim)
          if (result) {
            const filename = result[2]
            const line = parseInt(result[3])
            const column = parseInt(result[4])
            return { line, column, filename }
          }
        } else {
          // Firefox error
          const result = FirefoxErrorStackLineRegex.exec(lineTextTrim)
          if (result) {
            const filename = result[1]
            const line = parseInt(result[2])
            const column = parseInt(result[3])
            return { line, column, filename }
          }
        }
        return null
      })
      .filter(
        (s) => s !== null && s.filename !== '<anonymous>'
      ) as ErrorMessage['stack']

    return {
      message,
      stack,
    }
  } else {
    return null
  }
}
