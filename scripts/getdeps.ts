// retrieves eventfulTypes and eventfulLibs
import { copy, remove } from 'fs-extra'
import { exec } from 'child_process'
import { join } from 'path'

const deps = {
  types: 'https://github.com/xharris/eventfulTypes.git',
  'src/eventfulLib': 'https://github.com/xharris/eventfulLib.git',
}

Object.entries(deps).map(([dir, url]) =>
  remove(dir)
    .then(() => [dir, url])
    .then(
      ([dir, url]) =>
        new Promise<string>((res) => {
          const proc = exec(`git clone ${url} ${dir}`)
          proc.on('close', () => {
            res(dir)
          })
        })
    )
    // .then((dir) => remove(join(dir, '.git')).then(() => dir))
    .then((dir) => console.log(`${dir} created`))
)

export default {}
