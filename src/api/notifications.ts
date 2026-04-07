import api from './client';

export interface Notification {
  _id?: string;
  id?: string; // Sometimes mapped
  text: string;
  time: string;
  isNew: boolean;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await api.get('/notifications/');
  return response.data.map((n: any) => ({
    id: n._id || n.id,
    text: n.text,
    time: n.time,
    isNew: n.isNew
  }));
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await api.put(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await api.put('/notifications/read-all');
};
