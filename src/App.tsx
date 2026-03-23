import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './lib/supabase';
import { LoginView } from './components/auth/LoginView';
import { StatsGrid } from './components/dashboard/StatsGrid';
import { TransactionForms } from './components/dashboard/TransactionForms';
import { HistoryTable } from './components/dashboard/HistoryTable';
import { ProductsTable } from './components/products/ProductsTable';
import { StockManagement } from './components/stock/StockManagement';
import { Currency, Transaction, DashboardStats } from './types/finance';
import { ExchangeRateProvider, useExchangeRate } from './context/ExchangeRateContext';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { 
  LayoutDashboard, 
  PlusSquare, 
  History, 
  Package, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Wallet,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Banknote,
  ArrowRightLeft
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { startOfMonth, startOfWeek, isAfter, parseISO, isSameDay } from 'date-fns';

const AppContent: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { usdToCdfRate } = useExchangeRate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data as Transaction[] || []);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const convertToActive = (amount: number, fromCurrency: Currency): number => {
    if (fromCurrency === currency) return amount;
    
    // Base is USD for conversion
    let inUSD = amount;
    if (fromCurrency === 'CDF') inUSD = amount / usdToCdfRate;
    if (fromCurrency === 'EUR') inUSD = amount * 1.09; 

    // Now convert USD to active
    if (currency === 'USD') return inUSD;
    if (currency === 'CDF') return inUSD * usdToCdfRate;
    if (currency === 'EUR') return inUSD / 1.09;
    
    return amount;
  };

  const stats = useMemo<DashboardStats>(() => {
    const today = new Date();
    const startOfThisMonth = startOfMonth(today);
    const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });

    let totalSales = 0;
    let totalExpenses = 0;
    let dailySales = 0;
    let dailyExpenses = 0;
    let monthlySales = 0;
    let monthlyExpenses = 0;
    let weeklySales = 0;

    transactions.forEach(t => {
      const amountInActive = convertToActive(t.amount, t.currency as Currency);
      const tDate = parseISO(t.date);

      if (t.type === 'sale') {
        totalSales += amountInActive;
        if (isSameDay(tDate, today)) dailySales += amountInActive;
        if (isAfter(tDate, startOfThisMonth) || t.date === startOfThisMonth.toISOString().split('T')[0]) monthlySales += amountInActive;
        if (isAfter(tDate, startOfThisWeek) || t.date === startOfThisWeek.toISOString().split('T')[0]) weeklySales += amountInActive;
      } else {
        totalExpenses += amountInActive;
        if (isSameDay(tDate, today)) dailyExpenses += amountInActive;
        if (isAfter(tDate, startOfThisMonth) || t.date === startOfThisMonth.toISOString().split('T')[0]) monthlyExpenses += amountInActive;
      }
    });

    return {
      dailySales,
      dailyExpenses,
      dailyProfit: dailySales - dailyExpenses,
      currentBalance: totalSales - totalExpenses,
      monthlySales,
      monthlyExpenses,
      weeklySales,
      totalSales,
      totalExpenses,
      currency
    };
  }, [transactions, currency, usdToCdfRate]);

  const filteredSales = transactions.filter(t => t.type === 'sale' && t.currency === currency);
  const filteredExpenses = transactions.filter(t => t.type === 'expense' && t.currency === currency);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Déconnecté avec succès');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'saisie', label: 'Saisie Opérations', icon: PlusSquare },
    { id: 'transactions', label: 'Historique', icon: History },
    { id: 'stocks', label: 'Stocks', icon: Package },
    { id: 'produits', label: 'Catalogue', icon: Settings },
  ];

  if (!session) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <LoginView onLogin={() => {}} />
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-300">
      <Toaster position="top-right" richColors />
      
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-blue-600 border border-blue-500 rounded-xl shadow-lg text-white active:scale-95 transition-transform"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-[#0F172A] dark:bg-[#020617] border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-8 pb-10">
            <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/20 ring-4 ring-emerald-500/20">
                <ShieldCheck className="text-white" size={28} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-emerald-400 text-sm uppercase tracking-widest font-black">gestion</span>
                <span className="text-blue-400 text-2xl font-black">cash</span>
              </div>
            </h1>
          </div>

          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${
                  activeTab === item.id 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-900/40 scale-[1.02]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-white/20' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                    <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                  </div>
                  <span className={`font-bold tracking-tight ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`}>{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight size={16} className="text-white/70" />}
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-slate-800 bg-slate-900/50">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 shadow-sm mb-6">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRightLeft size={14} className="text-blue-400" />
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Devise d'affichage</label>
              </div>
              <div className="flex gap-2 p-1 bg-slate-900 rounded-xl border border-slate-700">
                {(['USD', 'CDF', 'EUR'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${
                      currency === c 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'text-slate-500 hover:text-emerald-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-4 text-rose-400 font-bold hover:bg-rose-500/10 rounded-2xl transition-all active:scale-95 group"
            >
              <div className="p-2 rounded-lg bg-rose-500/10 group-hover:bg-rose-500/20">
                <LogOut size={20} />
              </div>
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto bg-background transition-colors duration-300">
        <header className="bg-card/40 dark:bg-card/20 backdrop-blur-xl sticky top-0 z-30 border-b border-border p-5 lg:px-12 flex justify-between items-center shadow-sm">
          <div className="hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md shadow-blue-200 dark:shadow-blue-900/40">
                 {React.createElement(navItems.find(i => i.id === activeTab)?.icon || LayoutDashboard, { className: "text-white", size: 24 })}
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground tracking-tight leading-none mb-1">
                  {navItems.find(i => i.id === activeTab)?.label}
                </h2>
                <div className="flex items-center gap-2">
                   <ShieldCheck size={10} className="text-emerald-600 dark:text-emerald-500" />
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Système Sécurisé</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-8 ml-auto lg:ml-0">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                <Banknote size={14} className="text-emerald-600 dark:text-emerald-500" />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Solde Consolidé</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black tabular-nums ${stats.currentBalance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {stats.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs font-black text-muted-foreground">{currency}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-200 dark:shadow-emerald-900/40 ring-4 ring-emerald-50 dark:ring-emerald-950 cursor-pointer hover:scale-105 transition-transform">
                <Wallet size={24} className="lg:size-7" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-[1600px] mx-auto space-y-10">
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <StatsGrid stats={stats} />
            </div>
          )}

          {activeTab === 'saisie' && (
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
              <TransactionForms onTransactionAdded={fetchData} selectedCurrency={currency} />
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <HistoryTable 
                transactions={filteredSales} 
                title={`Ventes (${currency})`} 
                type="sale"
              />
              <HistoryTable 
                transactions={filteredExpenses} 
                title={`Dépenses (${currency})`} 
                type="expense"
              />
              <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-8 rounded-[2.5rem] shadow-xl shadow-blue-100 dark:shadow-blue-900/20 flex items-center justify-between text-white relative overflow-hidden group">
                <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-2">Note Multi-Devise</h3>
                  <p className="text-emerald-50 font-medium max-w-lg">
                    Toutes les dépenses effectuées en CDF ou EUR sont automatiquement converties selon le taux d'échange pour impacter votre solde global en USD.
                  </p>
                </div>
                <TrendingUp className="text-emerald-300 relative z-10 hidden md:block" size={48} />
              </div>
            </div>
          )}

          {activeTab === 'stocks' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <StockManagement />
            </div>
          )}

          {activeTab === 'produits' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <ProductsTable />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ExchangeRateProvider>
        <AppContent />
      </ExchangeRateProvider>
    </ThemeProvider>
  );
};

export default App;