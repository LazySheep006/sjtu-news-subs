import { SubscriptionSource } from './types';

// 配置：SJTU Theme Colors
export const THEME_COLOR = '#C8102E';

// 配置：可修改的订阅源列表
export const SUBSCRIPTION_SOURCES: SubscriptionSource[] = [
  { id: 'cs', label: '计算机学院' },
  { id: 'automation', label: '自动化与感知学院' },
  { id: 'ee', label: '电气工程学院' },
  { id: 'ic', label: '集成电路学院' },
  { id: 'jwc', label: '教务处' },
];

export const DEFAULT_TOAST_DURATION = 3000;
