import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import AdminForm from './AdminForm';
import { AdminSourceManagement } from './AdminSourceManagement';

export const AdminUI = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Admin Form" />
        <Tab label="Source Management" />
      </Tabs>
      <Box sx={{ marginTop: 3 }}>
        {activeTab === 0 && <AdminForm />}
        {activeTab === 1 && <AdminSourceManagement />}
      </Box>
    </Box>
  );
}

export default AdminUI;