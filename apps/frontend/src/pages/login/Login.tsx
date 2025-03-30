import { useState } from 'react';
import './Login.css';
import { useForm } from 'react-hook-form';
import { Alert, Button, Input, Link } from '@heroui/react';

export const LoginPage = () => {
  const loginSubmitCallback = async (formData: LoginFormInputs) => {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const { access_token } = await response.json();
    // TODO: store access_token securely (should use server side cookies instead of local-storage)
    console.log({ access_token });
    return access_token as string;
  };

  return <LoginForm onLoginSubmit={loginSubmitCallback} />;
};

type LoginFormInputs = { username: string; password: string };

type LoginFormProps = {
  onLoginSubmit: (formData: LoginFormInputs) => Promise<string | undefined>;
};
export const LoginForm = ({ onLoginSubmit }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const onSubmit = async (formData: LoginFormInputs) => {
    setIsLoading(true);

    try {
      const token = await onLoginSubmit(formData);
      if (!token) {
        setError('Invalid Username or Password');
        return;
      }

      setSuccess(`Success! You'll be redirected in a second`);
      setError('');
    } catch (e) {
      setError('Something went wrong, please try again later.');
      console.log({ e });
    } finally {
      setIsLoading(false);
    }

    // TODO: on login success navigate to /app (needs to be created still)
  };

  return (
    <div className="login-content">
      <div>
        <h3 className="login-header text-xl">Login-in to your Account</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="card form-container">
          <p>Please enter your credentials below</p>

          {error && <Alert hideIcon color="danger" title={error} />}
          {success && <Alert color="success" title={success} />}

          <Input
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
            isInvalid={!!errors.username}
            errorMessage={errors.username?.message}
          />

          <Input
            type="password"
            placeholder="Password"
            {...register('password', {
              required: true,
              minLength: {
                value: 5,
                message: 'Minimum length for passwords is 5',
              },
            })}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />

          <Button isLoading={isLoading} color="primary" type="submit">
            Login
          </Button>
        </form>

        <div className="login-footer card">
          New to this App? Feel free to <Link href="/signup">sign up</Link>!
        </div>
      </div>
    </div>
  );
};
