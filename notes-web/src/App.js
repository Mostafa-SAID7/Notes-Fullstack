import './App.css';
import { AppBar, Box, Button, Grid, Modal, TextField, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Note from './components/Note';

const API_BASE = 'http://localhost:5272/api/Notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [filteredList, setFilteredNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [openModal, setOpen] = useState(false);
  const [selId, setSelId] = useState(0);
  const [selTxt, setSelTxt] = useState('');
  const [selDesc, setSelDesc] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    fetch(API_BASE)
      .then(response => response.json())
      .then(data => {
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

  const filterData = (val) => {
    if (val !== '') {
      const list = notes.filter(
        note =>
          note.title.toLowerCase().includes(val.toLowerCase()) ||
          note.desc.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredNotes(list);
    } else {
      setFilteredNotes(notes);
    }
  };

  const doSearch = (e) => {
    setSearch(e.target.value);
    filterData(e.target.value);
  };

  const createNote = () => {
    setSelId(0);
    setSelTxt('');
    setSelDesc('');
    setOpen(true);
  };

  const save = () => {
    if (selTxt !== '' && selDesc !== '') {
      const method = selId === 0 ? 'POST' : 'PUT';
      fetch(API_BASE, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selId, title: selTxt, desc: selDesc }),
      })
        .then(() => { loadData(); setOpen(false); })
        .catch(() => setOpen(false));
    } else {
      alert('Title and description are required');
    }
  };

  const edit = (id, txt, desc) => {
    setSelId(id);
    setSelTxt(txt);
    setSelDesc(desc);
    setOpen(true);
  };

  const deleteNote = (id) => {
    fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
      .then(() => { loadData(); setOpen(false); })
      .catch(() => setOpen(false));
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Notes App
            </Typography>
            <TextField placeholder="Search..." style={{ marginLeft: 20 }} value={search} onChange={doSearch} />
          </Toolbar>
        </AppBar>
      </Box>

      <Modal open={openModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 400,
          bgcolor: 'background.paper', border: '2px solid #000',
          boxShadow: 24, p: 4,
        }}>
          <Typography variant="h6" component="h2">Enter Note Details</Typography>
          <TextField value={selTxt} placeholder="Title" fullWidth style={{ padding: 5 }} onChange={e => setSelTxt(e.target.value)} />
          <TextField rows={4} multiline value={selDesc} placeholder="Description" fullWidth style={{ padding: 5 }} onChange={e => setSelDesc(e.target.value)} />
          <Button variant="contained" onClick={save}>Save</Button>
          <Button variant="contained" onClick={() => setOpen(false)} style={{ marginLeft: 8 }}>Close</Button>
        </Box>
      </Modal>

      <Grid>
        <Grid lg={12} style={{ padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button variant="outlined" style={{ width: 300 }} onClick={createNote}>Take Note</Button>
        </Grid>
        <Grid lg={12} style={{ padding: 30 }}>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            NOTES
          </Typography>
        </Grid>
      </Grid>

      <Grid container lg={12} style={{ padding: 30 }}>
        {filteredList?.length > 0
          ? filteredList.map(note => (
            <Grid item lg={12 / 5} style={{ padding: 10 }} key={note.id}>
              <Note note={note} edit={edit} deleteNote={deleteNote} />
            </Grid>
          ))
          : 'No notes yet. Click "Take Note" to add one.'}
      </Grid>
    </>
  );
}

export default App;
