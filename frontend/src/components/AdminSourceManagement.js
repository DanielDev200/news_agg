import React, { useState, useEffect } from 'react';
import {Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Button,TextField,Checkbox,Paper,Modal,IconButton} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { fetchSources, createSource, updateSourceNotes } from '../api/api';

export const AdminSourceManagement = () => {
  const [sources, setSources] = useState([]);
  const [newSource, setNewSource] = useState({ source: '', loads_in_iframe: false });
  const [editNotes, setEditNotes] = useState({ id: null, notes: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadSources = async () => {
      try {
        const data = await fetchSources();
        setSources(data);
      } catch (error) {
        console.error('Error loading sources:', error);
      }
    };

    loadSources();
  }, []);

  const handleInputChange = (field, value) => {
    setNewSource({ ...newSource, [field]: value });
  };

  const handleAddSource = async () => {
    try {
      await createSource({ ...newSource, notes: '' });
  
      const updatedSources = await fetchSources();
      setSources(updatedSources);
  
      setNewSource({ source: '', loads_in_iframe: false });
    } catch (error) {
      console.error('Error adding source:', error);
    }
  };

  const handleEditNotes = (source) => {
    setEditNotes({ id: source.id, notes: source.notes });
    setIsModalOpen(true);
  };

  const handleSaveNotes = async () => {
    try {
      const updatedSource = await updateSourceNotes(editNotes.id, editNotes.notes);
      setSources((prev) =>
        prev.map((source) =>
          source.id === editNotes.id ? { ...source, notes: updatedSource.notes } : source
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Source</TableCell>
              <TableCell>Iframe</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sources.map((source) => (
              <TableRow key={source.id}>
                <TableCell>{source.source}</TableCell>
                <TableCell>
                  <Checkbox checked={Boolean(source.loads_in_iframe)} disabled />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditNotes(source)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {/* Row for Adding a New Source */}
            <TableRow>
              <TableCell>
                <TextField
                  label="Source"
                  value={newSource.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  fullWidth
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={newSource.loads_in_iframe}
                  onChange={(e) => handleInputChange('loads_in_iframe', e.target.checked)}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={handleAddSource}
                  size="small"
                  sx={{ width: '100%' }}
                >
                  Add
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="edit-notes-modal"
        aria-describedby="edit-notes-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <TextField
            label="Edit Notes"
            value={editNotes.notes}
            onChange={(e) => setEditNotes({ ...editNotes, notes: e.target.value })}
            fullWidth
            multiline
            rows={4}
          />
          <Box sx={{ marginTop: 2, textAlign: 'right' }}>
            <Button onClick={() => setIsModalOpen(false)} sx={{ marginRight: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveNotes}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminSourceManagement;
