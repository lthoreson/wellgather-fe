import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import { AuthContext } from '../context/auth'
import { useForm } from '../util/hooks'
import Home from './Home'

export default function Login(props) {
  const context = useContext(AuthContext)
  const [errors, setErrors] = useState({})
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: ''
  })
  const navigate = useNavigate()

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData)
      navigate('/')
    },
    onError(err) {
      if (err.graphQLErrors[0]) {
        setErrors(err.graphQLErrors[0].extensions.errors)
      }
    },
    variables: values
  })

  function loginUserCallback() {
    loginUser()
  }

  if (context.user) {
    return (<Home/>)
  }

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Login</h1>
        <Form.Input label="username" placeholder="Username.." name="username" type='text' value={values.username} error={errors.username ? true : false} onChange={onChange} />
        <Form.Input label="password" placeholder="Password.." name="password" type='password' value={values.password} error={errors.password ? true : false} onChange={onChange} />
        <Button type='submit' primary>Login</Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
      username: $username
      password: $password
    ){
      id email username createdAt token
    }
  }
`