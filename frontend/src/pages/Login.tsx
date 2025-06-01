import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
 
function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
 
  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.content}>
          <h1 style={styles.title}>¡Bienvenido al Sistema Médico de Wakanda!</h1>
          <p style={styles.subtitle}>Gestiona pacientes, médicos y citas con nuestra plataforma integral</p>
         
          <div style={styles.features}>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>🏥</div>
              <h3>Gestión Integral</h3>
              <p>Control total de pacientes, médicos y citas</p>
            </div>
           
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>🔒</div>
              <h3>Seguridad Garantizada</h3>
              <p>Protección de datos médicos con tecnología avanzada</p>
            </div>
          </div>
        </div>
      </div>
 
      <div style={styles.rightPanel}>
        <div style={styles.loginBox}>
          <h2 style={styles.loginTitle}>Inicio de Sesión</h2>
          <p style={styles.loginSubtitle}>Accede con tu cuenta de google</p>
         
          <div style={styles.googleButton}>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  const decoded: any = jwtDecode(credentialResponse.credential);
                  login(credentialResponse.credential, decoded.name, decoded.picture);
                  navigate('/dashboard');
                }
              }}
              onError={() => {
                console.log('Error al iniciar sesión con Google');
              }}
              theme="filled_blue"
              shape="pill"
              locale="es"
            />
          </div>
         
          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>Acceso exclusivo</span>
            <span style={styles.dividerLine}></span>
          </div>
         
          <p style={styles.disclaimer}>
            Al continuar, aceptas nuestros{' '}
            <a href="/terms" style={styles.link}>Términos de Servicio</a> y{' '}
            <a href="/privacy" style={styles.link}>Política de Privacidad</a>
          </p>
        </div>
      </div>
    </div>
  );
}
 
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #2a2a72 0%, #009ffd 100%)',
    color: '#fff',
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    overflow: 'auto'
  },
  content: {
    maxWidth: '600px',
    overflow: 'hidden'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
    lineHeight: 1.3
  },
  subtitle: {
    fontSize: '1.1rem',
    marginBottom: '3rem',
    opacity: 0.9
  },
  features: {
    display: 'grid',
    gap: '2rem'
  },
  featureItem: {
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)'
  },
  featureIcon: {
    fontSize: '2rem',
    marginBottom: '1rem'
  },
  loginBox: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    maxWidth: '450px',
    width: '100%',
    maxHeight: '95vh',
    overflowY: 'auto' as const
  },
  loginTitle: {
    fontSize: '2rem',
    color: '#2a2a72',
    marginBottom: '0.5rem'
  },
  loginSubtitle: {
    color: '#666',
    marginBottom: '2rem'
  },
  googleButton: {
    margin: '1.5rem 0',
    display: 'flex',
    justifyContent: 'center'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '2rem 0'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#eee'
  },
  dividerText: {
    padding: '0 1rem',
    color: '#666',
    fontSize: '0.9rem'
  },
  disclaimer: {
    textAlign: 'center' as const,
    color: '#666',
    fontSize: '0.9rem',
    lineHeight: 1.5
  },
  link: {
    color: '#2a2a72',
    textDecoration: 'none',
    fontWeight: '600'
  }
};
 
export default Login;