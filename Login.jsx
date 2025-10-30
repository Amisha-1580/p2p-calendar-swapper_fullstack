import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const path = isSignup ? '/api/auth/signup' : '/api/auth/login';
    const body = isSignup ? { name, email, password } : { email, password };
    try {
      const res = await fetch('http://localhost:4000' + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) return setErr(data.error || 'Auth error');
      localStorage.setItem('token', data.token);
      nav('/dashboard');
    } catch (e) { setErr('Network error'); }
  }

  return (
    <div className="col-md-6 offset-md-3">
      <h3>{isSignup ? 'Sign up' : 'Log in'}</h3>
      <form onSubmit={submit}>
        {isSignup && (
          <div className="mb-3">
            <label>Name</label>
            <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}
        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="mb-3 text-danger">{err}</div>
        <button className="btn btn-primary me-2" type="submit">{isSignup ? 'Sign up' : 'Log in'}</button>
        <button type="button" className="btn btn-link" onClick={() => { setIsSignup(!isSignup); setErr(''); }}>Switch to {isSignup ? 'Login' : 'Sign up'}</button>
      </form>
    </div>
  );
}

export default Login;
