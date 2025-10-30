import React, { useEffect, useState } from 'react';
import { authFetch } from '../api';

function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  async function load() {
    const inc = await authFetch('/swaps/incoming');
    setIncoming(await inc.json());
    const out = await authFetch('/swaps/outgoing');
    setOutgoing(await out.json());
  }

  useEffect(()=>{ load(); }, []);

  async function respond(id, accept) {
    const res = await authFetch('/swaps/respond/' + id, { method: 'POST', body: JSON.stringify({ accept }) });
    if (!res.ok) { const txt = await res.json(); alert('Error: ' + (txt.error || JSON.stringify(txt))); }
    else { alert('Done'); load(); }
  }

  return (
    <div>
      <h3>Incoming Requests</h3>
      <ul className="list-group mb-3">
        {incoming.map(r => (
          <li key={r.id} className="list-group-item">
            Request #{r.id} — from user {r.fromUserId} — status {r.status}
            <div className="mt-2">
              <button className="btn btn-success btn-sm me-2" onClick={()=>respond(r.id, true)}>Accept</button>
              <button className="btn btn-danger btn-sm" onClick={()=>respond(r.id, false)}>Reject</button>
            </div>
          </li>
        ))}
      </ul>

      <h3>Outgoing Requests</h3>
      <ul className="list-group">
        {outgoing.map(r => (
          <li key={r.id} className="list-group-item">Request #{r.id} — to {r.toUserId} — status {r.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default Requests;
