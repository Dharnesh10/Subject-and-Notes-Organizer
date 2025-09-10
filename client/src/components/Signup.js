import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { useState } from 'react'

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/api/users', formData);
      navigate('/login');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setError('Failed to sign up');
    }
  };
  console.log("Submitting formData:", formData);


  return (
    <div className='container py-5'>
        <div className='row justify-content-center'>
            <div className='col-12 col-sm-10 col-md-8 col-lg-6'>
                <div className='card shadow-sm'>
                    <div className='card-body'>
                        <h3 className='card-title'>Sign Up</h3>
                        <form onSubmit={handleSubmit}>
                            <div className='row'>
                                <div className='col-md-6 mb-3'>
                                    <label className='form-label text-start d-block'>First Name</label>
                                    <input 
                                        type='text' 
                                        className='form-control' 
                                        name='firstName' 
                                        placeholder='Enter your first name' 
                                        required 
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='col-md-6 mb-3'>
                                    <label className='form-label text-start d-block'>Last Name</label>
                                    <input 
                                        type='text' 
                                        className='form-control' 
                                        name='lastName' 
                                        placeholder='Enter your last name' 
                                        required 
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

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

                            <button type='submit' className='btn btn-primary w-100'>Sign Up</button>
                        </form>
                        <div className='text-center mt-3'>
                            <span>Already have an account?</span>{' '}
                            <Link to='/login'>Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Signup