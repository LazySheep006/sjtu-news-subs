import { createClient } from '@supabase/supabase-js';
import { UserSubscription } from '../types';

// ============================================================
// CONFIGURATION
// ============================================================
const SUPABASE_URL: string = 'https://lkgpvecudmsyredzouvt.supabase.co';
const SUPABASE_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrZ3B2ZWN1ZG1zeXJlZHpvdXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3ODQ2MzQsImV4cCI6MjA4MzM2MDYzNH0.dc4hbglLn24cqotq54yjtd5yXC48KDXM_t8l2UTiVAo';

// Initialize the client
const isConfigured = SUPABASE_URL !== 'YOUR_URL' && SUPABASE_KEY !== 'YOUR_KEY';

const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

export const upsertUserSubscription = async (data: Omit<UserSubscription, 'is_active'>) => {
  if (!supabase) {
    // Simulate a network delay and throw error if not configured
    await new Promise(resolve => setTimeout(resolve, 800));
    throw new Error('Supabase 未配置。请在代码中填写您的 URL 和 Key。');
  }

 const { error } = await supabase.rpc('manage_subscription', {
    _email: data.email,
    _name: data.name,
    _subs: data.subscriptions
  });

  if (error) {
    throw error;
  }
};

export const getSubscriberCount = async (): Promise<number> => {
  if (!supabase) return 0;
  const { data, error } = await supabase.rpc('get_subscriber_count');

  if (error) {
    console.error('Error fetching subscriber count:', error);
    return 0;
  }

  // RPC 返回的数据 (data) 直接就是那个数字
  return (data as number) || 0;
};