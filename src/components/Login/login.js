import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useMutation, gql } from "@apollo/client";



  const Login = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    login: true,
    email: '',
    password: '',
    name: ''
  });

  const cardWidth = {
    width: '35%'
  };

  function sendAuthetication () {
  
  }

  var AUTH_QUERY = gql `mutation{
    authMutation(email:"${formState.email}", password:"${formState.password}")
    {
      accessToken,
      refreshToken
    }
  }`;

  const REGISTER_QUERY =  gql `
    mutation{
      userCreateMutation(email:"${formState.email}", username: "${formState.name}", password: "${formState.password}"){
        user{
          id
          username
          email
        }
      }
    }`;

  const [authquery, { data, loading, error }] = useMutation(AUTH_QUERY,{
    onCompleted(data) {
      console.log(data);
    }
  });

  const [register, { res, load, err }] = useMutation(REGISTER_QUERY,{
    onCompleted(data) {
      setFormState({
        ...formState,
        login: true
      })
    }
  });

  if (error) {
    alert('Credenciales incorrectas')
    window.location.reload(false)
  };

  if (data) {
    localStorage.setItem('_token', data.authMutation.access_token);
    window.location.replace('/');

  }


  return (
    <div>
      <div className="container mt-6 d-flex justify-content-center align-items-center">
        <div className="card mt-25" style={cardWidth}>
            <div className="card-header bg-white">
                <h4 className="fw-bold">
                    {formState.login ? 'Iniciar sesion' : 'Registrate'}
                </h4>
            </div>
            <div className="card-body mt-2 mb-4">
                {!formState.login && (
                
                <input className='form-control m-2'
                    value={formState.name}
                    onChange={(e) =>
                    setFormState({
                        ...formState,
                        name: e.target.value
                    })
                    }
                    type="text"
                    placeholder="Username"
                />
                )}
                <input className='form-control m-2' 
                value={formState.email}
                onChange={(e) =>
                    setFormState({
                    ...formState,
                    email: e.target.value
                    })
                }
                type="email"
                placeholder="Correo electronico"
                />
                <input
                className='form-control m-2'
                value={formState.password}
                onChange={(e) =>
                    setFormState({
                    ...formState,
                    password: e.target.value
                    })
                }
                type="password"
                placeholder="Contraseña"
                />
                {!formState.login && (
                
                <button className='btn btn-primary w-100 m-2' onClick={register}>Registrate</button>
                )}
                {formState.login && (
                
                <button className='btn btn-primary w-100 m-2 '  onClick={authquery}>Iniciar sesion</button>
                )}
            </div>
            <div className="card-footer bg-white d-flex justify-content-between">
                <button
                className="btn btn-link"
                onClick={() => console.log('onClick')}
                >
                {formState.login ? 'Iniciar sesion' : 'Crear cuenta'}
                </button>
                <button
                className="btn-link"
                onClick={(e) =>
                    setFormState({
                    ...formState,
                    login: !formState.login
                    })
                }
                >
                {formState.login
                    ? 'Crear una cuenta'
                    : 'Iniciar sesion'}
                </button>
            </div>
        </div>
      </div>
      
    </div>
  );
};

export default Login;