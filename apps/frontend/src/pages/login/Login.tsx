import { useState } from 'react';
import './Login.css';
import { useForm } from 'react-hook-form';
import { Button } from '@heroui/react';

export const LoginPage = () => {
  return (
    <div className="login-content">
      <div>
        <h3 className="login-header">Login-in to your Account</h3>
        <LoginForm />
        <Footer />
      </div>
    </div>
  );
};

type LoginFormInputs = { username: string; password: string };

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  // TODO: general error message in case service is down

  const onSubmit = async (formData: LoginFormInputs) => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const { access_token } = await response.json();
      // TODO: store access_token securely (should use server side cookies instead of local-storage)
      console.log({ access_token });
    } catch (e) {
      console.log({ e });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card form-container">
      <p>Please enter your credentials below</p>

      <input
        type="text"
        placeholder="E-Mail"
        {...register('username', {
          required: true,
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'invalid email format',
          },
          maxLength: {
            value: 320,
            message: 'maximum length exceeded',
          },
        })}
      />
      {errors.username && <span role="alert">{errors.username.message}</span>}

      <input
        type="password"
        placeholder="Password"
        {...register('password', {
          required: true,
          minLength: { value: 5, message: 'Minimum length for passwords is 5' },
        })}
      />
      {errors.password && <span role="alert">{errors.password.message}</span>}

      <Button disabled={isLoading} color="primary" type="submit">
        Login
      </Button>
    </form>
  );
};

const Footer = () => (
  <div className="login-footer card">
    New to this App? Feel free to <a href="/signup">sign up</a>!
  </div>
);
