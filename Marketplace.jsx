import React, { useEffect, useState } from 'react';
import { authFetch } from '../api';

function Marketplace() {
  const [available, setAvailable] = useState([]);
  const [mySwappables, setMySwappables] = useState([]);
  const [selectedTheir, setSelectedTheir] = useState(null);
  const [selectedMy, setSelectedMy] = useState(null);

  async function load() {
    const a = await authFetch('/swaps/available');
    setAvailable(await a.json());
    const m = await authFetch('/events');
    const my = await m.json();
    setMySwappables(my.filter(x => x.status === 'SWAPPABLE'));
  }

  useEffect(()=>{ load(); }, []);

  async function requestSwap() {
    if (!selectedTheir || !selectedMy) return alert('Pick both slots');
    const res = await authFetch('/swaps/request', { method: 'POST', body: JSON.stringify({ mySlotId: selectedMy, theirSlotId: selectedTheir }) });
    if (!res.ok) {
      const txt = await res.json();
      alert('Error: ' + (txt.error || JSON.stringify(txt)));
    } else {
      alert('Request created');
      load();
    }
  }

  return (
    <div>
      <h3>Marketplace — Available Slots</h3>
      <div className="row">
        <div className="col-md-6">
          <h5>Other users' swappable slots</h5>
          <ul className="list-group">
            {available.map(a => (
              <li key={a.id} className="list-group-item">
                <strong>{a.title}</strong><br />{a.startTime} - {a.endTime}<br />Owner: {a.ownerId}
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="their" onChange={()=>setSelectedTheir(a.id)} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-6">
          <h5>My swappable slots</h5>
          <ul className="list-group mb-2">
            {mySwappables.map(m => (
              <li key={m.id} className="list-group-item">
                <strong>{m.title}</strong><br />{m.startTime} - {m.endTime}
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="my" onChange={()=>setSelectedMy(m.id)} />
                </div>
              </li>
            ))}
          </ul>
          <button className="btn btn-primary" onClick={requestSwap}>Request Swap</button>
        </div>
      </div>
    </div>
  );
}

export default Marketplace;
