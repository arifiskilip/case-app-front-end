import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../services/api'; // Ensure this is configured correctly
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  email: yup.string()
    .email('Geçerli bir email adresi girin')
    .required('Email gerekli')
    .min(5, 'Email en az 5 karakter olmalıdır')
    .max(255, 'Email en fazla 255 karakter olabilir'),
  password: yup.string()
    .required('Şifre gerekli')
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .max(50, 'Şifre en fazla 50 karakter olabilir'),
});

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/login', data);
      console.log(response.data); // Check response structure
      const token = response.data.accessToken.token;
      localStorage.setItem('token', token);
      Swal.fire("Başarılı", "Giriş işlemi başarılı.", "success");
      navigate("/tasks");
    } catch (error) {
      console.log(error); // Check error object
      Swal.fire("Hata", error.response?.data?.detail || 'Bir hata oluştu', "error");
    }
  };

  return (
    <div className="login-box">
      <div className="card card-outline card-dark">
        <div className="card-header text-center">
          <a className="h1"><b>Case App</b></a>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="login-box-msg">Giriş yapmak için bilgilerinizi doldurun</p>
            <div className="input-group mb-3">
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Email"
                {...register('email')}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-envelope"></span>
                </div>
              </div>
              {errors.email && (
                <div className="invalid-feedback">
                  {errors.email.message}
                </div>
              )}
            </div>
            <div className="input-group mb-3">
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Password"
                {...register('password')}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock"></span>
                </div>
              </div>
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-dark btn-block">
              <i className="fas fa-lock me-1"></i>
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
