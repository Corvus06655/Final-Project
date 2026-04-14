import { useState, useEffect, useCallback } from 'react';
import { apiGetDashboard, apiGetInventory, apiGetPredictions, apiUpdateStock } from '../api.js';
import Chart from '../components/Chart.jsx';
import s from './Dashboard.module.css';

const URGENCY_COLOR = { critical:'var(--rose)', high:'var(--amber)', medium:'var(--cyan)', low:'var(--lime)', none:'var(--fog)' };
const DOT = { ok:'var(--lime)', low_stock:'var(--amber)', out_of_stock:'var(--rose)', info:'var(--cyan)', restock:'var(--lime)', sale:'var(--rose)', import:'var(--cyan)', adjustment:'var(--amber)' };

export default function Dashboard() {
  const [stats,   setStats]   = useState(null);
  const [inv,     setInv]     = useState([]);
  const [preds,   setPreds]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [err,     setErr]     = useState('');
  const [stockModal, setStockModal] = useState(null); // { item }
  const [stockForm,  setStockForm]  = useState({ type:'sale', qty:'', note:'' });
  const [stockBusy,  setStockBusy]  = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = useCallback(async () => {
    setLoading(true); setErr('');
    try {
      const [ds, is, ps] = await Promise.all([
        apiGetDashboard(),
        apiGetInventory({ limit: 100 }),
        apiGetPredictions(),
      ]);
      setStats(ds.stats);
      setInv(is.inventory || []);
      setPreds(ps.predictions?.slice(0, 6) || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStockUpdate = async () => {
    if (!stockModal || !stockForm.qty) return;
    setStockBusy(true);
    try {
      const change = stockForm.type === 'sale' ? -Math.abs(+stockForm.qty) : Math.abs(+stockForm.qty);
      await apiUpdateStock(stockModal._id, stockForm.type, change, stockForm.note);
      showToast('Stock updated successfully!');
      setStockModal(null);
      setStockForm({ type:'sale', qty:'', note:'' });
      load();
    } catch (e) {
      showToast('Error: ' + e.message);
    } finally {
      setStockBusy(false);
    }
  };

  const kpis = stats ? [
    { v: stats.totalProducts,               l:'Total Products',   c:'var(--lime)'   },
    { v: stats.inStock,                     l:'In Stock',         c:'var(--green)'  },
    { v: stats.lowStock,                    l:'Low Stock',        c:'var(--amber)'  },
    { v: `₹${(stats.totalStockValue||0).toLocaleString('en-IN')}`, l:'Stock Value', c:'var(--cyan)' },
  ] : [];

  if (loading) return (
    <div className={`pg ${s.center}`}>
      <div className={s.spinner}/><p style={{color:'var(--fog)',marginTop:'1rem'}}>Loading dashboard…</p>
    </div>
  );

  if (err) return (
    <div className={`pg ${s.center}`}>
      <div className={s.errBox}>
        <div style={{fontSize:'2rem',marginBottom:'.5rem'}}>⚠️</div>
        <p style={{color:'var(--rose)',marginBottom:'1rem'}}>{err}</p>
        <p style={{color:'var(--fog)',fontSize:'.85rem'}}>Make sure the backend is running on port 5001</p>
        <button className={s.retryBtn} onClick={load}>Retry</button>
      </div>
    </div>
  );

  return (
    <div className={s.pg}>
      {toast && <div className={s.toast}>{toast}</div>}

      {/* Header */}
      <div className={s.head}>
        <div className={s.headIn}>
          <div className={s.headTop}>
            <div>
              <div className={s.hl}>Analytics Dashboard</div>
              <div className={s.sub}>Live data from MongoDB · PredictiveSys v2.4</div>
            </div>
            <button className={s.refreshBtn} onClick={load}>↻ Refresh</button>
          </div>
          <div className={s.kpis}>
            {kpis.map((k,i) => (
              <div className={s.kc} key={i}>
                <span className={s.kv} style={{color:k.c}}>{k.v}</span>
                <span className={s.kl}>{k.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s.body}>
        {/* Predictions + Activity */}
        <div className={s.grid2}>
          {/* AI Predictions */}
          <div className={s.panel}>
            <div className={s.ptitle}>🤖 AI Predictions — Reorder Urgency</div>
            <div className={s.predList}>
              {preds.length === 0
                ? <p style={{color:'var(--fog)',fontSize:'.85rem'}}>No predictions available yet. Add inventory items first.</p>
                : preds.map(p => (
                <div className={s.predItem} key={p.productId}>
                  <div style={{flex:1}}>
                    <div className={s.predName}>{p.productName}</div>
                    <div className={s.predMeta}>
                      {p.daysUntilStockout != null ? `~${p.daysUntilStockout}d until stockout` : 'No consumption data'} · {p.dailyConsumption}/day
                    </div>
                  </div>
                  <div>
                    <span className={s.urgBadge} style={{color:URGENCY_COLOR[p.reorderUrgency],borderColor:URGENCY_COLOR[p.reorderUrgency]+'44',background:URGENCY_COLOR[p.reorderUrgency]+'14'}}>
                      {p.reorderUrgency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={s.panel}>
            <div className={s.ptitle}>Recent Activity</div>
            <div className={s.feed}>
              {(stats?.recentActivity?.length ? stats.recentActivity : []).map((a,i) => (
                <div className={s.aitem} key={i}>
                  <div className={s.adot} style={{background: DOT[a.type] || 'var(--fog)'}}/>
                  <span className={s.amsg}>
                    <strong>{a.product?.name || 'Unknown'}</strong> — {a.type} {Math.abs(a.quantityChange)} units
                    {a.note ? ` (${a.note})` : ''}
                  </span>
                  <span className={s.atime}>{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
              {!stats?.recentActivity?.length && <p style={{color:'var(--fog)',fontSize:'.85rem'}}>No recent activity</p>}
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className={s.panel} style={{marginTop:'1.25rem'}}>
          <div className={s.ptitle}>
            <span>Inventory Overview</span>
            <span style={{fontSize:'.68rem',color:'var(--fog)'}}>{inv.length} products</span>
          </div>
          <div style={{overflowX:'auto'}}>
            <table className={s.tbl}>
              <thead>
                <tr><th>Product</th><th>SKU</th><th>Category</th><th>Stock</th><th>Reorder Point</th><th>Cost</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {inv.map(p => {
                  const stMap = { in_stock:'ok', low_stock:'wn', out_of_stock:'cr' };
                  const st = stMap[p.stockStatus] || 'wn';
                  return (
                    <tr key={p._id}>
                      <td style={{fontWeight:500}}>{p.name}</td>
                      <td className={s.mono} style={{color:'var(--fog)'}}>{p.sku}</td>
                      <td style={{fontSize:'.72rem',color:'var(--fog)'}}>{p.category}</td>
                      <td className={s.mono}>{p.quantity?.toLocaleString()}</td>
                      <td className={s.mono} style={{color:'var(--fog)'}}>{p.reorderPoint}</td>
                      <td className={s.mono} style={{color:'var(--fog)'}}>₹{p.costPrice}</td>
                      <td><span className={`${s.badge} ${s['b_'+st]}`}>
                        {p.stockStatus === 'in_stock' ? '● In Stock' : p.stockStatus === 'low_stock' ? '⚠ Low Stock' : '✕ Out of Stock'}
                      </span></td>
                      <td>
                        <button className={s.actBtn} onClick={()=>setStockModal(p)}>Update Stock</button>
                      </td>
                    </tr>
                  );
                })}
                {inv.length === 0 && <tr><td colSpan={8} style={{textAlign:'center',color:'var(--fog)',padding:'2rem'}}>No inventory items. Import a CSV or add products.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stock Update Modal */}
      {stockModal && (
        <div className={s.overlay} onClick={()=>setStockModal(null)}>
          <div className={s.modal} onClick={e=>e.stopPropagation()}>
            <div className={s.modalTitle}>Update Stock — {stockModal.name}</div>
            <div className={s.modalSub}>Current: <strong>{stockModal.quantity}</strong> {stockModal.unit}</div>
            <div className={s.fg2}>
              <label>Type</label>
              <select value={stockForm.type} onChange={e=>setStockForm(f=>({...f,type:e.target.value}))}>
                <option value="sale">Sale (decrease)</option>
                <option value="restock">Restock (increase)</option>
                <option value="adjustment">Adjustment</option>
                <option value="damage">Damage (decrease)</option>
                <option value="return">Return (increase)</option>
              </select>
            </div>
            <div className={s.fg2}>
              <label>Quantity</label>
              <input type="number" min="1" placeholder="e.g. 50" value={stockForm.qty} onChange={e=>setStockForm(f=>({...f,qty:e.target.value}))}/>
            </div>
            <div className={s.fg2}>
              <label>Note (optional)</label>
              <input type="text" placeholder="e.g. Weekend sale" value={stockForm.note} onChange={e=>setStockForm(f=>({...f,note:e.target.value}))}/>
            </div>
            <div className={s.modalBtns}>
              <button className={s.cancelBtn} onClick={()=>setStockModal(null)}>Cancel</button>
              <button className={s.confirmBtn} onClick={handleStockUpdate} disabled={stockBusy}>
                {stockBusy ? 'Updating…' : 'Update Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
