import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import TicketTable from '../components/TicketTable';
import TicketFormModal from '../components/TicketFormModal';
import TicketDetail from '../components/TicketDetail';
import AssignModal from '../components/AssignModal';
import { getTickets, createTicket, assignTicket, getCurrentUser } from '../api/ticketService';
import { normalizeRole, isStaff } from '../utils/roleUtils';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      alert('Failed to fetch tickets: ' + (error.message || 'Network error'));
    }
  };

  const loadCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUserId(currentUser.userId);
      const rawRole = Array.isArray(currentUser.roles)
        ? currentUser.roles[0] || ''
        : typeof currentUser.roles === 'string'
          ? currentUser.roles
          : '';
      setUserRole(normalizeRole(rawRole));
      setIsUserLoading(false);
      fetchTickets();
    } catch (error) {
      console.error('Failed to load current user:', error);
      alert('Failed to load auth user: ' + (error.message || 'Please login again.'));
      setIsUserLoading(false);
    }
  };

  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  if (isUserLoading) {
    return <div>Loading user...</div>;
  }

  
  const handleCreateTicket = async (ticketData) => {
    try {
      const attachmentFilePaths = ticketData.attachments
        ? await Promise.all(ticketData.attachments.map(readFileAsDataUrl))
        : [];

      const payload = {
        ...ticketData,
        attachmentFilePaths,
      };
      delete payload.attachments;

      await createTicket(payload);
      alert('Ticket created successfully!');
      setIsFormModalOpen(false);
      fetchTickets(); // Refresh list
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Failed to create ticket: ' + error.message);
    }
  };

  const handleViewTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedTicketId(null);
  };

  const handleAssignTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (ticketId, assignedToId) => {
    try {
      await assignTicket(ticketId, assignedToId);
      alert('Ticket assigned successfully!');
      fetchTickets(); // Refresh list
    } catch (error) {
      console.error('Failed to assign ticket:', error);
      alert('Failed to assign ticket: ' + error.message);
    }
  };

  const handleUpdateStatus = (ticketId) => {
    // For simplicity, just refresh or handle in detail view
    fetchTickets();
  };

  return (
    <div className="space-y-6">
      {viewMode === 'list' ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-slate-900">Ticket Management</h1>
            {!isStaff(userRole) && (
            <button
              onClick={() => setIsFormModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus size={20} />
              Create Ticket
            </button>
          )}
          </div>
          <TicketTable
            tickets={tickets}
            onView={handleViewTicket}
            onAssign={handleAssignTicket}
            onUpdateStatus={handleUpdateStatus}
            userRole={userRole}
          />
        </>
      ) : (
        <TicketDetail
          ticketId={selectedTicketId}
          onBack={handleBackToList}
          userId={userId}
          userRole={userRole}
        />
      )}

      <TicketFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleCreateTicket}
        userId={userId}
      />

      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignSubmit}
        ticketId={selectedTicketId}
      />
    </div>
  );
};

export default Tickets;