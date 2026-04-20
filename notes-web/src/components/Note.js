import React from 'react';
import { Card, CardActions, CardContent, Grid, Typography, MenuItem, Popover } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';

function Note({ note, edit, deleteNote })
{
    const [anchorEl, setAnchorEl] = React.useState(null);
    const divRef = React.useRef();


    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" + note.id : undefined;
    function handleClick()
    {
        setAnchorEl(divRef.current);
    }
    function handleClose()
    {
        setAnchorEl(null);
    }
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardContent>
                <Typography variant="h6" component="div" style={{ paddingBottom: 10 }}>
                    {note.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {note.desc}
                </Typography>
            </CardContent>
            <CardActions style={{ justifyContent: 'flex-end' }}>
                <MoreVertIcon sx={{ fontSize: 20 }} ref={divRef} onClick={handleClick} />
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}
                    key={'menu-' + note.id}
                >
                    <MenuItem onClick={() => { handleClose(); edit(note.id, note.title, note.desc) }}><span>Edit</span></MenuItem>
                    <MenuItem onClick={() => { handleClose(); deleteNote(note.id) }}><span>Delete</span></MenuItem>
                </Popover>
            </CardActions>
        </Card>
    );
}

export default Note;