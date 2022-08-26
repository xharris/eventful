import 'dotenv/config'
import { move, remove } from 'fs-extra'
import { copyFile, writeFile, readFile } from 'fs/promises'
import { join } from 'path'

import { replaceTscAliasPaths } from 'tsc-alias'

replaceTscAliasPaths({
  configFile: 'api/tsconfig.json',
})
  .then(() => remove('out/ui'))
  .then(() => move('build', 'out/ui'))

// const keys = ['REACT_APP_FIREBASE_API_KEY']

// const proc: Record<any, any> = {}
// for (const key of keys) {
//   proc[key] = process.env[key]
// }
// const config = `
// const process = {
//   env: ${JSON.stringify(proc, null, 2)}
// }`

// // writeFile('sw-env.js', config)

// copyFile('firebase-messaging-sw.js', join('build', 'firebase-messaging-sw.js'))
//   .then(() => readFile(join('build', 'firebase-messaging-sw.js'), 'utf-8'))
//   .then((contents) =>
//     writeFile(join('build', 'firebase-messaging-sw.js'), `${config}\n\n${contents}`, 'utf-8')
//   )

export default {}
