import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { useFormik } from 'formik';
import userValidationSchema from '../Validation/signupValidationSchema.jsx';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/style.css';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice.mjs';

const apiUrl = import.meta.env.REACT_APP_API_URL;

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: userValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      console.log('Form submitted with values:', values);
      try {
        const response = await axios.post(`${apiUrl}/signup`, values, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setLoading(false);
        console.log('response:', response);
        if (response.status >= 200 && response.status < 300) {
          dispatch(
            login({
              token: response.data.token,
              userID: response.data.userID,
              userName: values.name,
            })
          );
          Swal.fire({
            title: 'Success!',
            text: 'You have signed up successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate('/showalltask');
          });
        } else {
          console.log('Error:', response);

          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        setLoading(false);
        console.log('Error:', error);
        if (error.response && error.response.status === 409) {
          Swal.fire({
            title: 'Error!',
            text: 'Email already exists. Please use a different email.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} id="Signup" className="signup-container">
      <div className="signup-form">
        <div className="signup-form-section">
          <h1>Sign Up</h1>

          <div className="signup-input-field">
            <input
              type="text"
              name="name"
              placeholder="Username"
              {...formik.getFieldProps('name')}
              className="signup-input-field"
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="signup-error-message">{formik.errors.name}</div>
            ) : null}
            <FaUser className="input-icon" />
          </div>

          <div className="signup-input-field">
            <input
              type="email"
              name="email"
              placeholder="Email"
              {...formik.getFieldProps('email')}
              className="signup-input-field"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="signup-error-message">{formik.errors.email}</div>
            ) : null}
            <FaEnvelope className="input-icon" />
          </div>

          <div className="signup-input-field">
            <input
              type="password"
              name="password"
              placeholder="Password"
              {...formik.getFieldProps('password')}
              className="signup-input-field"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="signup-error-message">{formik.errors.password}</div>
            ) : null}
            <FaLock className="input-icon" />
          </div>
          <button type="submit" disabled={loading} className="signup-button">
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

          <p>or sign up with social platforms</p>
          <div className="signup-social-auth">
            <a href="" className="signup-social-button">
              <FaGoogle />
            </a>
            <a href="" className="signup-social-button">
              <FaFacebookF />
            </a>
            <a href="" className="signup-social-button">
              <FaGithub />
            </a>
            <a href="" className="signup-social-button">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
        <div className="signup-welcome-section">
          <div className="signup-welcome-content">
            <h2>Hello, Welcome!</h2>
            <p>Already have an account?</p>
            <Link to="/login" className="signup-auth-link-button">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Signup;
