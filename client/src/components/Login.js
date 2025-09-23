import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api' // axios instance

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await api.post('/auth', formData)
      // save token to localStorage
      localStorage.setItem('token', response.data.token)
      // redirect to dashboard or home
      navigate('/')
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data || 'Invalid email or password'
      )
    }
  }

  return (
    <div className='container py-5'>
      <div className='row justify-content-center'>
        <div className='col-12 col-sm-10 col-md-8 col-lg-6'>
          <div className='card shadow-sm'>
            <div className='card-body'>
              <h3 className='card-title'>Login</h3>

              {error && (
                <div className='alert alert-danger'>{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label className='form-label text-start d-block'>Email</label>
                  <input
                    type='email'
                    name='email'
                    className='form-control'
                    placeholder='Enter your email'
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className='mb-3'>
                  <label className='form-label text-start d-block'>Password</label>
                  <input
                    type='password'
                    name='password'
                    className='form-control'
                    placeholder='Enter your password'
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <button type='submit' className='btn btn-primary w-100'>
                  Login
                </button>
              </form>

              <div className='text-center mt-3'>
                <span>Don't have an account?</span>{' '}
                <Link to='/signup'>Register</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
