import { useEffect, useState } from 'react';
import { fetchAdminLectures, loginAdmin } from '../services/adminApi';

export default function UpdateLectures() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loginMessage, setLoginMessage] = useState('');

  async function loadLectures() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminLectures();
      setLectures(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLectures();
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setLoginMessage('');
    setError('');
    try {
      await loginAdmin(credentials.email, credentials.password);
      setLoginMessage('Login successful. Reloading lectures...');
      loadLectures();
    } catch (loginError) {
      setError(loginError.message);
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Update Lectures</h1>
      <p>Fetch all admin lectures and review current content.</p>

      <form onSubmit={handleLogin} style={{ display: 'grid', gap: '8px', maxWidth: '360px', marginBottom: '16px' }}>
        <input
          type="email"
          placeholder="Admin email"
          value={credentials.email}
          onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Admin password"
          value={credentials.password}
          onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
          required
        />
        <button type="submit">Login & Save Token</button>
      </form>

      <button type="button" onClick={loadLectures} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh Lectures'}
      </button>

      {loginMessage ? <p style={{ color: 'green' }}>{loginMessage}</p> : null}
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}

      <div style={{ marginTop: '16px', display: 'grid', gap: '10px' }}>
        {lectures.map((lecture) => (
          <div key={lecture.lectureId} style={{ background: '#fff', padding: '12px', borderRadius: '8px' }}>
            <h3 style={{ margin: 0 }}>{lecture.name}</h3>
            <p style={{ margin: '4px 0' }}>ID: {lecture.lectureId}</p>
            <p style={{ margin: '4px 0' }}>
              Difficulty: {lecture.difficulty} | Language: {lecture.language} | Points: {lecture.points}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
