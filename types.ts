export interface UserSubscription {
  email: string;
  name: string;
  subscriptions: string[];
  is_active: boolean;
}

export interface ToastState {
  type: 'success' | 'error' | null;
  message: string;
}

export type SubscriptionSource = {
  id: string;
  label: string;
}