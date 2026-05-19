/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: Login
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio Login
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSelector from '../../components/common/LanguageSelector';
import './Login.css';

/**
 * Página de login
 * Permite a los usuarios autenticarse en el sistema
 */
/**
 * Componente Login
 * @returns {JSX.Element}
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión con Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('No se pudo conectar con Google. Intenta nuevamente.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <LanguageSelector />
        </div>
        <div className="login-header">
          <h1>{t('login.title')}</h1>
          <h2>{t('login.subtitle')}</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">{t('login.emailLabel')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t('login.emailPlaceholder')}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('login.passwordLabel')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t('login.passwordPlaceholder')}
              disabled={loading}
              minLength={6}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? t('login.loading') : t('login.loginButton')}
          </button>
        </form>

        <div className="social-login-container" style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            shape="rectangular"
            theme="filled_blue"
          />
        </div>

        <div className="login-footer">
          <p>
            {t('login.noAccount')} <Link to="/register">{t('login.registerHere')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
