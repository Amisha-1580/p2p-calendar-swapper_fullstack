import React, { useEffect, useState } from 'react';
import { authFetch } from '../api';

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  async function load() {
    const res = await authFetch('/events');
    const js = await res.json();
    setEvents(js);
  }
  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    await authFetch('/events', { method: 'POST', body: JSON.stringify({ title, startTime, endTime }) });
    setTitle(''); setStartTime(''); setEndTime('');
    load();
  }

  async function toggleSwappable(ev) {
    const newStatus = ev.status === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE';
    await authFetch('/events/' + ev.id, { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
    load();
  }

  return (
    <div>
      <h3>My Events</h3>
      <form onSubmit={create} className="mb-3">
        <input className="form-control mb-1" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="form-control mb-1" placeholder="Start (ISO) e.g. 2025-11-01T10:00:00Z" value={startTime} onChange={e=>setStartTime(e.target.value)} />
        <input className="form-control mb-1" placeholder="End (ISO)" value={endTime} onChange={e=>setEndTime(e.target.value)} />
        <button className="btn btn-success">Create</button>
      </form>

      <table className="table">
        <thead><tr><th>Title</th><th>Start</th><th>End</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev.id}>
              <td>{ev.title}</td>
              <td>{ev.startTime}</td>
              <td>{ev.endTime}</td>
              <td>{ev.status}</td>
              <td><button className="btn btn-sm btn-outline-primary" onClick={()=>toggleSwappable(ev)}>{ev.status==='SWAPPABLE'?'Make Busy':'Make Swappable'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
