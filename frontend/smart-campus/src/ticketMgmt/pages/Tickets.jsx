import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import TicketTable from '../components/TicketTable';
import TicketFormModal from '../components/TicketFormModal';
import TicketDetail from '../components/TicketDetail';
import AssignModal from '../components/AssignModal';
import { getTickets, createTicket, assignTicket } from '../api/ticketService';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  // Mock user data - replace with actual auth
  const userId = 1; // Example user ID
  const userRole = 'ADMIN'; // 'STUDENT', 'TECHNICIAN', 'ADMIN'

  useEffect(() => {
    fetchTickets();
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

  const handleCreateTicket = async (ticketData) => {
    try {
      await createTicket(ticketData);
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
            <button
              onClick={() => setIsFormModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus size={20} />
              Create Ticket
            </button>
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