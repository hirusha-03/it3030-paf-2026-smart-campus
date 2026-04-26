import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search } from 'lucide-react';
import TicketTable from '../components/TicketTable';
import TicketFormModal from '../components/TicketFormModal';
import TicketDetail from '../components/TicketDetail';
import AssignModal from '../components/AssignModal';
import { getTickets, createTicket, uploadAttachment, assignTicket, getCurrentUser, deleteTicket } from '../api/ticketService';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState([]);
  const [priorityFilters, setPriorityFilters] = useState([]);
  const [assignmentFilter, setAssignmentFilter] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isFilterOpen) return;
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

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

  // attachments are uploaded after creation using the ticket detail upload control

  if (isUserLoading) {
    return <div>Loading user...</div>;
  }

  
  const handleCreateTicket = async (ticketData) => {
    try {
      // Create ticket first without attachments (attachments uploaded separately)
      const payload = { ...ticketData };
      delete payload.attachments;
      const created = await createTicket(payload);

      // Upload attachments one-by-one
      if (ticketData.attachments && ticketData.attachments.length > 0) {
        await Promise.all(ticketData.attachments.map((f) => uploadAttachment(created.id, f)));
      }
      alert('Ticket created successfully!');
      setIsFormModalOpen(false);
      fetchTickets(); // Refresh list
    } catch (error) {
      console.error('Failed to create ticket:', error);
      const serverMessage = error.response?.data?.message || error.message || 'Network error';
      alert('Failed to create ticket: ' + serverMessage);
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

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Delete this ticket permanently?')) return;
    try {
      await deleteTicket(ticketId);
      alert('Ticket deleted');
      fetchTickets();
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      alert('Failed to delete ticket: ' + (error.message || 'Network error'));
    }
  };

  const handleUpdateStatus = (ticketId) => {
    // For simplicity, just refresh or handle in detail view
    fetchTickets();
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchesSearch = (ticket) => {
    if (!normalizedQuery) return true;
    const createdBy = ticket.createdBy?.name || '';
    const assignedTo = ticket.assignedTo?.name || '';
    const title = ticket.title || '';
    const category = ticket.category || '';
    return [title, category, createdBy, assignedTo]
      .some((value) => value.toLowerCase().includes(normalizedQuery));
  };

  const matchesFilters = (ticket) => {
    const hasStatusFilters = statusFilters.length > 0;
    const hasPriorityFilters = priorityFilters.length > 0;
    const hasAssignmentFilter = assignmentFilter.length > 0;

    if (!hasStatusFilters && !hasPriorityFilters && !hasAssignmentFilter) {
      return true;
    }

    const statusMatch = hasStatusFilters ? statusFilters.includes(ticket.status) : false;
    const priorityMatch = hasPriorityFilters ? priorityFilters.includes(ticket.priority) : false;
    const assignmentMatch = hasAssignmentFilter
      ? (assignmentFilter === 'assigned' ? !!ticket.assignedTo : !ticket.assignedTo)
      : false;

    return statusMatch || priorityMatch || assignmentMatch;
  };

  const visibleTickets = tickets.filter((ticket) => matchesSearch(ticket) && matchesFilters(ticket));

  const toggleFilter = (value, setter) => {
    setter((prev) => prev.includes(value)
      ? prev.filter((item) => item !== value)
      : [...prev, value]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {viewMode === 'list' ? (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-xl">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tickets by title, category, or user..."
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
            <div className="relative" ref={filterRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-indigo-400"
              >
                Filters
                {(statusFilters.length > 0 || priorityFilters.length > 0 || assignmentFilter) && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                    Active
                  </span>
                )}
              </button>

              {isFilterOpen && (
                <div className="mt-2 w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-lg p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                      {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => toggleFilter(status, setStatusFilters)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                            statusFilters.includes(status)
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400'
                          }`}
                        >
                          {status.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</span>
                      {['HIGH', 'MEDIUM', 'LOW'].map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => toggleFilter(priority, setPriorityFilters)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                            priorityFilters.includes(priority)
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400'
                          }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignment</span>
                      {['assigned', 'unassigned'].map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setAssignmentFilter((prev) => (prev === key ? '' : key))}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                            assignmentFilter === key
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400'
                          }`}
                        >
                          {key === 'assigned' ? 'Assigned' : 'Unassigned'}
                        </button>
                      ))}
                      {(statusFilters.length > 0 || priorityFilters.length > 0 || assignmentFilter) && (
                        <button
                          type="button"
                          onClick={() => {
                            setStatusFilters([]);
                            setPriorityFilters([]);
                            setAssignmentFilter('');
                          }}
                          className="ml-auto text-xs text-slate-500 hover:text-slate-700"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <TicketTable
            tickets={visibleTickets}
            onView={handleViewTicket}
            onAssign={handleAssignTicket}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteTicket}
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
        userRole={userRole}
      />
      </div>
    </div>
  );
};

export default Tickets;