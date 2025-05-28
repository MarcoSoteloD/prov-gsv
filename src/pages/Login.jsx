import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/login.scss';

export default function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token);
      navigate('/dashboard');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Proveedores GSV</h1>
        <div>
          <label>Email</label>
          <input {...register('email')} type="email" />
        </div>
        <div>
          <label>Contraseña</label>
          <input {...register('password')} type="password" />
        </div>
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Cargando...' : 'Iniciar sesión'}
        </button>
        {mutation.isError && <div className="error">{mutation.error.message}</div>}
      </form>
    </div>
  );
}