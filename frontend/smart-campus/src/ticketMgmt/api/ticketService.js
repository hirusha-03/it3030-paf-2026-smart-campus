const API_BASE = 'http://localhost:8080/api/tickets';

export const createTicket = async (ticketData, userId) => {
  const response = await fetch(`${API_BASE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority,
      attachmentFilePaths: ticketData.attachments || [],
      userId,
    }),
  });
  if (!response.ok) throw new Error('Failed to create ticket');
  return response.json();
};

export const getTicketsForUser = async (userId) => {
  const response = await fetch(`${API_BASE}/user/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch tickets');
  return response.json();
};

export const getTicketById = async (ticketId) => {
  const response = await fetch(`${API_BASE}/${ticketId}`);
  if (!response.ok) throw new Error('Failed to fetch ticket');
  return response.json();
};

export const assignTicket = async (ticketId, assignedToId, adminId) => {
  const response = await fetch(`${API_BASE}/${ticketId}/assign`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ assignedToId }),
  });
  if (!response.ok) throw new Error('Failed to assign ticket');
  return response.json();
};

export const updateTicketStatus = async (ticketId, status, userId) => {
  const response = await fetch(`${API_BASE}/${ticketId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update status');
  return response.json();
};

export const addComment = async (ticketId, message, userId) => {
  const response = await fetch(`${API_BASE}/${ticketId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) throw new Error('Failed to add comment');
  return response.json();
};