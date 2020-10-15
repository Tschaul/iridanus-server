export type UserSubscriptionResult = UserInfoSubscriptionResult;

export type UserInfo = {
  userId: string
  email: string;
  emailConfirmed: boolean;
  telegramConfirmed: boolean;
  telegramCode?: string;
};

export interface UserInfoSubscriptionResult {
  type: 'USER/INFO',
  info: UserInfo
}