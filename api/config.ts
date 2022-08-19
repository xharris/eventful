export const PORT = process.env.PORT ?? 3000
export const DATABASE_URI = `${process.env.DATABASE_URI}/${process.env.DATABASE_NAME}`
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
