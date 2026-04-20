import { useEffect, useState } from 'react';
import Note from './components/Note';
import type { Note as NoteType, NotePayload } from './types/note';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5272/api/Notes';

function App() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [filteredList, setFilteredNotes] = useState<NoteType[]>([]);
  const [search, setSearch] = useState('');
  const [openModal, setOpen] = useState(false);
  const [selId, setSelId] = useState(0);
  const [selTxt, setSelTxt] = useState('');
  const [selDesc, setSelDesc] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = (): void => {
    fetch(API_BASE)
      .then(r => r.json())
      .then((data: NoteType[]) => {
        setNotes(data);
        setFilteredNotes(data);
        setSearch('');
      })
      .catch(() => {
        setNotes([]);
        setFilteredNotes([]);
        setSearch('');
      });
  };

  const filterData = (val: string): void => {
    if (val !== '') {
      setFilteredNotes(
        notes.filter(n =>
          n.title.toLowerCase().includes(val.toLowerCase()) ||
          n.desc.toLowerCase().includes(val.toLowerCase()),
        ),
      );
    } else {
      setFilteredNotes(notes);
    }
  };

  const doSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
    filterData(e.target.value);
  };

  const createNote = (): void => {
    setSelId(0);
    setSelTxt('');
    setSelDesc('');
    setOpen(true);
  };

  const save = (): void => {
    if (selTxt.trim() === '' || selDesc.trim() === '') {
      alert('Title and description are required');
      return;
    }
    const payload: NotePayload = { id: selId, title: selTxt, desc: selDesc };
    fetch(API_BASE, {
      method: selId === 0 ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(() => { loadData(); setOpen(false); })
      .catch(() => setOpen(false));
  };

  const edit = (id: number, txt: string, desc: string): void => {
    setSelId(id);
    setSelTxt(txt);
    setSelDesc(desc);
    setOpen(true);
  };

  const deleteNote = (id: number): void => {
    fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
      .then(() => { loadData(); setOpen(false); })
      .catch(() => setOpen(false));
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">

      {/* Navbar */}
      <nav className="app-navbar">
        <span className="app-navbar-title">📝 Notes App</span>
        <input
          className="app-search"
          placeholder="Search notes..."
          value={search}
          onChange={doSearch}
        />
        <button className="btn-primary" onClick={createNote}>
          + New Note
        </button>
      </nav>

      {/* Main content */}
      <main className="container mx-auto px-6 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-1">My Notes</h1>
          <p className="text-slate-400 text-sm">
            {filteredList.length} {filteredList.length === 1 ? 'note' : 'notes'}
            {search && ` matching "${search}"`}
          </p>
        </div>

        {filteredList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredList.map(note => (
              <Note key={note.id} note={note} onEdit={edit} onDelete={deleteNote} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl">📭</div>
            <p className="text-slate-400 text-base">No notes yet.</p>
            <button className="btn-primary" onClick={createNote}>
              Take your first note
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {openModal && (
        <div
          className="modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="modal-box">
            <h2 className="modal-title">{selId === 0 ? 'New Note' : 'Edit Note'}</h2>

            <input
              className="modal-input"
              placeholder="Title"
              value={selTxt}
              onChange={e => setSelTxt(e.target.value)}
            />

            <textarea
              className="modal-textarea"
              placeholder="Description"
              rows={5}
              value={selDesc}
              onChange={e => setSelDesc(e.target.value)}
            />

            <div className="flex gap-3 justify-end pt-1">
              <button className="btn-secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={save}>
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
