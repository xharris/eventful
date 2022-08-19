import { cleanDB } from './helpers/db'

async function globalTeardown() {
  await cleanDB()
}

export default globalTeardown
