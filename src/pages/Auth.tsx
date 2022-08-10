import { useFormik } from 'formik'
import { useCallback } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'src/components/Button'
import { Checkbox } from 'src/components/Checkbox'
import { Flex } from 'src/components/Flex'
import { H1 } from 'src/components/Header'
import { Input } from 'src/components/Input'
import { api } from 'src/libs/api'
import { useSession } from 'src/libs/session'
import { Eventful } from 'types'

export const Auth = () => {
  const { logIn, signUp } = useSession()
  const [signingUp, setSigningUp] = useState(false)
  const navigate = useNavigate()

  const onSubmit = useCallback(
    (values: Eventful.API.LogInOptions & Eventful.API.SignUpOptions) => {
      if (signingUp) {
        signUp(values).then(() => navigate(-1))
      } else {
        logIn(values).then(() => navigate(-1))
      }
    },
    [signingUp]
  )

  const { values, handleChange, submitForm } = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirm_password: '',
      remember: false,
    },
    onSubmit,
  })

  return (
    <Flex css={{ padding: '$root', alignItems: 'center' }} fill>
      <Flex column>
        <H1>{signingUp ? 'Sign up' : 'Log in'}</H1>
        <Button onClick={() => setSigningUp(!signingUp)}>
          {!signingUp ? 'Sign up instead' : 'Log in instead'}
        </Button>
      </Flex>
      <Flex column>
        {signingUp ? (
          <>
            <Input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              value={values.username}
            />
            <Input
              name="password"
              placeholder="Password"
              type="password"
              onChange={handleChange}
              value={values.password}
            />
            <Input
              name="confirm_password"
              placeholder="Confirm password"
              type="password"
              onChange={handleChange}
              value={values.confirm_password}
            />
          </>
        ) : (
          <>
            <Input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              value={values.username}
            />
            <Input
              name="password"
              placeholder="Password"
              type="password"
              onChange={handleChange}
              value={values.password}
            />
          </>
        )}
        <Checkbox
          label="remember me"
          name="remember"
          checked={values.remember}
          onChange={handleChange}
        />
        <Button onClick={submitForm}>{signingUp ? 'Sign up' : 'Log in'}</Button>
      </Flex>
    </Flex>
  )
}
