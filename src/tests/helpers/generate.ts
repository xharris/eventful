import casual from 'casual'

export const user = () => ({
  username: casual.username,
  password: casual.password,
})
