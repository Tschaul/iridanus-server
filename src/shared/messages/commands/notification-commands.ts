export type NotificationCommand = NotificationMarkAsReadCommand;

export interface NotificationMarkAsReadCommand {
  type: 'NOTIFICATIONS/MARK_AS_READ',
  notificationIds: string[]
}