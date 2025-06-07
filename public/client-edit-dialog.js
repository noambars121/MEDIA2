import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function ClientEditDialog({ client, onSave, onClose }) {
  const [form, setForm] = useState({ ...client });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }
  function handleTags(e) {
    setForm(f => ({ ...f, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }));
  }
  function handleSocial(e, platform) {
    setForm(f => ({ ...f, social_accounts: { ...f.social_accounts, [platform]: e.target.value } }));
  }
  function handleTimeline(e) {
    setForm(f => ({ ...f, activity_timeline: e.target.value.split('\n').map(t => t.trim()).filter(Boolean) }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.message || 'שגיאה בשמירה');
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg text-right space-y-4 relative" onSubmit={handleSubmit}>
        <button type="button" className="absolute top-4 end-4 text-2xl" aria-label="סגור" onClick={onClose}>×</button>
        <h2 className="text-2xl font-bold mb-2">עריכת לקוח</h2>
        {error && <div className="text-error font-bold mb-2">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">שם</label>
            <input name="name" value={form.name || ''} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label className="block mb-1">אימייל</label>
            <input name="email" value={form.email || ''} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block mb-1">טלפון</label>
            <input name="phone" value={form.phone || ''} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block mb-1">סוג העסק</label>
            <input name="business_type" value={form.business_type || ''} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block mb-1">סיווג</label>
            <input name="classification" value={form.classification || ''} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block mb-1">תגיות (מופרדות בפסיק)</label>
            <input name="tags" value={(form.tags || []).join(', ')} onChange={handleTags} className="input" />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">הערות</label>
            <textarea name="notes" value={form.notes || ''} onChange={handleChange} className="input" />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">קול המותג</label>
            <input name="brand_voice" value={form.brand_voice || ''} onChange={handleChange} className="input" />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">העדפות תוכן</label>
            <input name="content_preferences" value={form.content_preferences || ''} onChange={handleChange} className="input" />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">חשבונות חברתיים (platform:url, אחד בכל שורה)</label>
            <textarea value={Object.entries(form.social_accounts || {}).map(([k,v])=>k+':'+v).join('\n')} onChange={e => {
              const lines = e.target.value.split('\n').map(l => l.trim()).filter(Boolean);
              const obj = {};
              lines.forEach(line => {
                const [k, ...rest] = line.split(':');
                if (k && rest.length) obj[k.trim()] = rest.join(':').trim();
              });
              setForm(f => ({ ...f, social_accounts: obj }));
            }} className="input" />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">היסטוריית פעילות (שורה לכל פעילות)</label>
            <textarea value={(form.activity_timeline || []).join('\n')} onChange={handleTimeline} className="input" />
          </div>
        </div>
        <button type="submit" className="bg-primary-blue text-white rounded px-6 py-2 font-bold mt-4" disabled={saving}>{saving ? 'שומר...' : 'שמור שינויים'}</button>
      </form>
      <style>{`.input{width:100%;padding:0.5rem 0.75rem;border-radius:0.5rem;border:1px solid #d1d5db;margin-bottom:0.25rem}`}</style>
    </div>
  );
}

export function openClientEditDialog({ root, client, onSave }) {
  if (!root) return;
  root.innerHTML = '';
  const reactRoot = createRoot(root);
  function handleClose() {
    reactRoot.unmount();
    root.innerHTML = '';
  }
  reactRoot.render(
    <ClientEditDialog client={client} onSave={onSave} onClose={handleClose} />
  );
} 