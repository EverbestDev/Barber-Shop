import api from './client';

export interface Notification {
  _id?: string;
  id?: string;
  text: string;
  time?: string;
  isNew: boolean;
  created_at?: string;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await api.get('/notifications/');
  return response.data.map((n: any) => ({
    id: n._id || n.id,
    text: n.text,
    time: n.time || null,
    isNew: n.isNew,
    created_at: n.created_at
  }));
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await api.put(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await api.put('/notifications/read-all');
};
