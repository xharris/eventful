import debug from 'debug'
import { Logging } from 'src/eventfulLib/log'

const root = debug('eventful')

export const logger: Logging = {
  methods: {
    debug: root,
    info: root,
    warn: root,
    error: root,
  },
  extend: (ext) => {
    const extension = root.extend(ext)
    return {
      debug: extension.extend('debug'),
      info: extension.extend('info'),
      warn: extension.extend('warn'),
      error: extension.extend('error'),
    }
  },
}
