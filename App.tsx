import React, { useState } from 'react';
import { GraduationCap, Mail, User, Check, Loader2, Trophy, Sparkles } from 'lucide-react';
import { SUBSCRIPTION_SOURCES } from './constants';
import { upsertUserSubscription, getSubscriberCount } from './services/supabaseService';
import { ToastState } from './types';
import { Toast } from './components/Toast';

// Success Modal Component
interface SuccessModalProps {
  count: number;
  subscriptions: string[];
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ count, subscriptions, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-[scale-in_0.3s_ease-out]">
        {/* Decorative Header */}
        <div className="bg-gradient-to-br from-sjtuRed to-red-700 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="modal-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="white"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#modal-grid)" />
             </svg>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-md mb-4 shadow-inner ring-4 ring-white/10">
              <Check size={48} className="text-white" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">订阅成功!</h2>
            <p className="text-red-100 text-sm">SJTU 资讯日报将准时送达</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8">
          <div className="flex flex-col items-center space-y-6">
            
            {/* Rank Badge */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                  <Trophy size={24} />
                </div>
                <div>
                  <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider">Subscriber Rank</p>
                  <p className="text-gray-800 font-medium text-sm">您是第 <span className="text-2xl font-bold text-sjtuRed mx-1">{count}</span> 位订阅者</p>
                </div>
              </div>
              <Sparkles className="text-yellow-400 opacity-50" />
            </div>

            {/* Subscriptions List */}
            <div className="w-full">
              <p className="text-gray-500 text-sm mb-3 font-medium">已订阅内容：</p>
              <div className="flex flex-wrap gap-2">
                {subscriptions.map((sub, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-sjtuRed border border-red-100"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] transition-all"
            >
              完成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ type: null, message: '' });
  
  // State for success modal
  const [successData, setSuccessData] = useState<{ count: number; subs: string[] } | null>(null);

  const handleSourceToggle = (label: string) => {
    setSelectedSources(prev => 
      prev.includes(label) 
        ? prev.filter(s => s !== label) 
        : [...prev, label]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSources.length === 0) {
      setToast({ type: 'error', message: '请至少选择一个订阅源' });
      return;
    }

    setLoading(true);
    setToast({ type: null, message: '' });

    try {
      await upsertUserSubscription({
        email,
        name,
        subscriptions: selectedSources
      });
      
      // Fetch the updated subscriber count
      const count = await getSubscriberCount();
      
      // Instead of toast, show the modal
      setSuccessData({
        count: count,
        subs: selectedSources
      });

    } catch (error: any) {
      console.error(error);
      setToast({ 
        type: 'error', 
        message: error.message || '提交失败，请稍后重试' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSuccessData(null);
    // Optional: clear form
    // setEmail('');
    // setName('');
    // setSelectedSources([]);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans text-gray-800">
      
      <Toast toast={toast} onClose={() => setToast({ type: null, message: '' })} />

      {successData && (
        <SuccessModal 
          count={successData.count} 
          subscriptions={successData.subs} 
          onClose={handleCloseModal} 
        />
      )}

      <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-xl overflow-hidden border border-white/50 ring-1 ring-black/5 transition-all">
        
        {/* Header Section */}
        <div className="bg-sjtuRed p-10 text-center relative overflow-hidden">
          {/* Abstract geometric shapes */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-10 bottom-0 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
          
          {/* Subtle Grid */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
             </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-white space-y-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md shadow-lg ring-1 ring-white/20">
              <GraduationCap size={48} className="text-white drop-shadow-md" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">SJTU 资讯日报</h1>
              <div className="h-1 w-12 bg-white/30 mx-auto rounded-full mb-2"></div>
              <p className="text-sjtuRed-50 text-sm md:text-base max-w-md opacity-90 leading-relaxed">
                基于 AI 的校园通知聚合助手<br/>每天自动推送您关注的学院动态
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 md:p-10 bg-white">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Basic Info Group */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-1 bg-sjtuRed rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">基本信息</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 group">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-sjtuRed">
                    交大邮箱 <span className="text-sjtuRed">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-sjtuRed transition-colors">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sjtuRed/20 focus:border-sjtuRed transition-all outline-none"
                      placeholder="your.name@sjtu.edu.cn"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-sjtuRed">
                    称呼
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-sjtuRed transition-colors">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sjtuRed/20 focus:border-sjtuRed transition-all outline-none"
                      placeholder="例如：交大吴彦祖"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Subscriptions Group */}
            <div className="space-y-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-sjtuRed rounded-full"></div>
                  <h2 className="text-xl font-bold text-gray-900">订阅源</h2>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded-md">可多选</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SUBSCRIPTION_SOURCES.map((source) => {
                  const isSelected = selectedSources.includes(source.label);
                  return (
                    <label
                      key={source.id}
                      className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group ${
                        isSelected
                          ? 'border-sjtuRed bg-red-50 shadow-sm'
                          : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-red-200 hover:shadow-md'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => handleSourceToggle(source.label)}
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-300 ${
                        isSelected 
                          ? 'bg-sjtuRed border-sjtuRed scale-110' 
                          : 'border-gray-300 bg-white group-hover:border-sjtuRed/50'
                      }`}>
                        {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className={`font-semibold text-lg transition-colors ${isSelected ? 'text-sjtuRed' : 'text-gray-700'}`}>
                        {source.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Action Group */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center py-4 px-6 rounded-xl text-white font-bold text-lg shadow-xl shadow-sjtuRed/20 transition-all duration-300 transform ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed scale-[0.98]'
                    : 'bg-gradient-to-r from-sjtuRed to-[#A60D26] hover:brightness-110 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={24} />
                    正在同步...
                  </>
                ) : (
                  '立即订阅'
                )}
              </button>
              <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
                点击订阅即表示您同意接收每日邮件推送。<br/>
                不想看了？随时可以在邮件底部取消订阅。
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;