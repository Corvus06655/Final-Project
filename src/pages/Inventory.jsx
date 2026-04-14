import { useState, useEffect, useCallback } from 'react';
import { apiGetInventory, apiCreateItem, apiDeleteItem, apiImportCSV, apiGetCategories } from '../api.js';
import s from './Inventory.module.css';

const EMPTY = { name:'', sku:'', category:'', quantity:0, unit:'units', costPrice:0, sellingPrice:0, reorderPoint:10, reorderQuantity:50, description:'' };

export default function Inventory() {
  const [inv,       setInv]       = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [cats,      setCats]      = useState([]);
  const [showAdd,   setShowAdd]   = useState(false);
  const [form,      setForm]      = useState(EMPTY);
  const [busy,      setBusy]      = useState(false);
  const [toast,     setToast]     = useState('');
  const [csvFile,   setCsvFile]   = useState(null);
  const [csvResult, setCsvResult] = useState(null);
  const [csvBusy,   setCsvBusy]   = useState(false);
  const [err,       setErr]       = useState('');

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(''), 3500); };

  const load = useCallback(async () => {
    setLoading(true); setErr('');
    try {
      const params = {};
      if (search)    params.search   = search;
      if (catFilter) params.category = catFilter;
      const [ir, cr] = await Promise.all([
        apiGetInventory({ ...params, limit: 200 }),
        apiGetCategories(),
      ]);
      setInv(ir.inventory || []);
      setCats(cr.categories || []);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }, [search, catFilter]);

  useEffect(() => { load(); }, [load]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleAdd = async () => {
    if (!form.name || !form.sku || !form.category) return showToast('Name, SKU and Category are required');
    setBusy(true);
    try {
      await apiCreateItem({
        ...form,
        quantity:        +form.quantity,
        costPrice:       +form.costPrice,
        sellingPrice:    +form.sellingPrice,
        reorderPoint:    +form.reorderPoint,
        reorderQuantity: +form.reorderQuantity,
      });
      showToast('✓ Product added successfully!');
      setShowAdd(false);
      setForm(EMPTY);
      load();
    } catch(e) { showToast('Error: '+e.message); }
    finally { setBusy(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await apiDeleteItem(id);
      showToast('Product deleted');
      load();
    } catch(e) { showToast('Error: '+e.message); }
  };

  const handleCSV = async () => {
    if (!csvFile) return;
    setCsvBusy(true); setCsvResult(null);
    try {
      const res = await apiImportCSV(csvFile);
      setCsvResult(res);
      showToast(res.message);
      load();
    } catch(e) { showToast('Import failed: '+e.message); }
    finally { setCsvBusy(false); }
  };

  const statusClass = st => st==='in_stock'?s.sok:st==='low_stock'?s.swn:s.scr;
  const statusLabel = st => st==='in_stock'?'● In Stock':st==='low_stock'?'⚠ Low Stock':'✕ Out of Stock';

  // Compute stats
  const inStock   = inv.filter(p=>p.stockStatus==='in_stock').length;
  const lowStock  = inv.filter(p=>p.stockStatus==='low_stock').length;
  const outStock  = inv.filter(p=>p.stockStatus==='out_of_stock').length;

  return (
    <div className={`pg ${s.pg}`}>
      {toast && <div className={s.toast}>{toast}</div>}

      <div className={s.header}>
        <div className={s.headerIn}>
          <div>
            <h1 className={s.hl}>Inventory Management</h1>
            <p className={s.sub}>
              <span className={s.liveDot}/>
              {inv.length} products · connected to MongoDB
            </p>
          </div>
          <div className={s.headerBtns}>
            <button className={s.addBtn} onClick={()=>setShowAdd(true)}>+ Add Product</button>
          </div>
        </div>
      </div>

      <div className={s.body}>

        {/* Live stats pills */}
        {!loading && inv.length > 0 && (
          <div className={s.statsRow}>
            <div className={s.statPill}><span className={s.statDot} style={{background:'var(--lime)'}}/>In Stock: <strong style={{color:'var(--snow)'}}>{inStock}</strong></div>
            <div className={s.statPill}><span className={s.statDot} style={{background:'var(--amber)'}}/>Low Stock: <strong style={{color:'var(--amber)'}}>{lowStock}</strong></div>
            <div className={s.statPill}><span className={s.statDot} style={{background:'var(--rose)'}}/>Out of Stock: <strong style={{color:'var(--rose)'}}>{outStock}</strong></div>
            <div className={s.statPill} style={{marginLeft:'auto'}}>
              <span style={{color:'var(--fog)'}}>Total SKUs:</span> <strong style={{color:'var(--snow)'}}>{inv.length}</strong>
            </div>
          </div>
        )}

        {/* CSV Import Card */}
        <div className={s.csvCard}>
          <div className={s.csvLeft}>
            <div className={s.csvIcon}>📤</div>
            <div>
              <div className={s.csvTitle}>Import Inventory via CSV</div>
              <div className={s.csvSub}>Upload a CSV with columns: name, sku, category, quantity, unit, costPrice, sellingPrice, reorderPoint, reorderQuantity</div>
            </div>
          </div>
          <div className={s.csvRight}>
            <label className={s.fileLabel}>
              <input type="file" accept=".csv" onChange={e=>setCsvFile(e.target.files[0])} style={{display:'none'}}/>
              {csvFile ? csvFile.name : 'Choose CSV file'}
            </label>
            <button className={s.importBtn} onClick={handleCSV} disabled={!csvFile||csvBusy}>
              {csvBusy ? 'Importing…' : 'Import CSV'}
            </button>
            <a
              href="data:text/csv,name,sku,category,quantity,unit,costPrice,sellingPrice,reorderPoint,reorderQuantity,description%0AWireless Earbuds Pro,WEP-001,Electronics,120,units,45,75,30,80,Sample product"
              download="sample-inventory.csv"
              className={s.sampleLink}
            >↓ Download Sample</a>
          </div>
          {csvResult && (
            <div className={s.csvResult}>
              <span style={{color:'var(--lime)'}}>✓ {csvResult.message}</span>
              {csvResult.errors?.length>0 && <span style={{color:'var(--amber)',marginLeft:'1rem'}}>⚠ {csvResult.errors.length} errors</span>}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className={s.filters}>
          <input className={s.searchIn} type="text" placeholder="🔍  Search products or SKU…" value={search} onChange={e=>setSearch(e.target.value)}/>
          <select className={s.catSel} value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
            <option value="">All Categories</option>
            {cats.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {err && <div className={s.errBox}>⚠️ {err} — make sure backend is running on port 5001</div>}

        {loading
          ? <div className={s.loadRow}><div className={s.spinner}/> Loading inventory…</div>
          : (
          <div style={{overflowX:'auto'}}>
            <table className={s.tbl}>
              <thead>
                <tr><th>Product</th><th>SKU</th><th>Category</th><th>Qty</th><th>Unit</th><th>Cost ₹</th><th>Sell ₹</th><th>Reorder</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {inv.map((p,i)=>(
                  <tr key={p._id} style={{animationDelay:`${i*0.03}s`}}>
                    <td style={{fontWeight:500}}>{p.name}</td>
                    <td className={s.mono} style={{color:'var(--fog)'}}>{p.sku}</td>
                    <td style={{fontSize:'.72rem',color:'var(--fog)'}}>{p.category}</td>
                    <td className={s.mono}><strong>{p.quantity?.toLocaleString()}</strong></td>
                    <td style={{fontSize:'.72rem',color:'var(--fog)'}}>{p.unit}</td>
                    <td className={s.mono} style={{color:'var(--fog)'}}>₹{p.costPrice}</td>
                    <td className={s.mono} style={{color:'var(--fog)'}}>₹{p.sellingPrice}</td>
                    <td className={s.mono} style={{color:'var(--fog)'}}>{p.reorderPoint}</td>
                    <td><span className={`${s.badge} ${statusClass(p.stockStatus)}`}>{statusLabel(p.stockStatus)}</span></td>
                    <td>
                      <button className={s.delBtn} onClick={()=>handleDelete(p._id, p.name)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {inv.length===0&&!loading&&<tr><td colSpan={10} style={{textAlign:'center',color:'var(--fog)',padding:'2rem'}}>No products found. Import a CSV or add manually.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAdd && (
        <div className={s.overlay} onClick={()=>setShowAdd(false)}>
          <div className={s.modal} onClick={e=>e.stopPropagation()}>
            <div className={s.modalTitle}>Add New Product</div>
            <div className={s.mGrid}>
              {[['name','Product Name','text'],['sku','SKU','text'],['category','Category','text'],['quantity','Initial Quantity','number'],['unit','Unit','text'],['costPrice','Cost Price (₹)','number'],['sellingPrice','Selling Price (₹)','number'],['reorderPoint','Reorder Point','number'],['reorderQuantity','Reorder Quantity','number']].map(([k,l,t])=>(
                <div className={s.fg2} key={k}>
                  <label>{l}</label>
                  <input type={t} value={form[k]} onChange={set(k)} placeholder={l}/>
                </div>
              ))}
              <div className={s.fg2} style={{gridColumn:'span 2'}}>
                <label>Description</label>
                <input type="text" value={form.description} onChange={set('description')} placeholder="Optional description"/>
              </div>
            </div>
            <div className={s.modalBtns}>
              <button className={s.cancelBtn} onClick={()=>setShowAdd(false)}>Cancel</button>
              <button className={s.confirmBtn} onClick={handleAdd} disabled={busy}>{busy?'Adding…':'Add Product'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
