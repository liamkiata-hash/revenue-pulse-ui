import React from 'react';
import { Card, CardContent } from '../ui/card';
import { TrendingUp, TrendingDown, Wallet, CircleDollarSign, CalendarDays, CalendarRange, Landmark, PieChart, ArrowRightLeft, ShieldCheck, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardStats } from '../../types/finance';
import { ExchangeRateManager } from './ExchangeRateManager';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import { convertCurrency } from '../../lib/utils';

interface StatsGridProps {
  stats: DashboardStats;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const { usdToCdfRate } = useExchangeRate();
  
  const targetCurrency = stats.currency === 'USD' ? 'CDF' : 'USD';
  const convertedBalance = convertCurrency(stats.currentBalance, stats.currency, targetCurrency, usdToCdfRate);

  const categories = [
    {
      label: "Performance Quotidienne",
      icon: CalendarDays,
      items: [
        { title: 'Ventes du jour', amount: stats.dailySales, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100/50 dark:bg-emerald-500/10', icon: TrendingUp, border: 'border-emerald-200 dark:border-emerald-500/20' },
        { title: 'Dépenses du jour', amount: stats.dailyExpenses, color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-100/50 dark:bg-rose-500/10', icon: TrendingDown, border: 'border-rose-200 dark:border-rose-500/20' },
        { title: 'Bénéfice du jour', amount: stats.dailyProfit, color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100/50 dark:bg-blue-500/10', icon: CircleDollarSign, border: 'border-blue-200 dark:border-blue-500/20' },
      ]
    },
    {
      label: "Vue d'ensemble Périodique",
      icon: CalendarRange,
      items: [
        { title: 'Ventes de la semaine', amount: stats.weeklySales, color: 'text-emerald-800 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/5', icon: PieChart, border: 'border-emerald-100 dark:border-emerald-500/10' },
        { title: 'Ventes du mois', amount: stats.monthlySales, color: 'text-emerald-900 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/10', icon: Landmark, border: 'border-emerald-200 dark:border-emerald-500/20' },
        { title: 'Dépenses du mois', amount: stats.monthlyExpenses, color: 'text-rose-800 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/5', icon: TrendingDown, border: 'border-rose-100 dark:border-rose-500/10' },
      ]
    }
  ];

  return (
    <div className="space-y-10">
      {/* Exchange Rate Manager Section */}
      <ExchangeRateManager />

      {/* Main Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-slate-900 via-[#1E293B] to-[#0F172A] p-8 lg:p-14 text-white shadow-2xl shadow-blue-900/40 border border-slate-800"
      >
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:row items-start lg:items-center justify-between gap-12">
          <div className="w-full lg:w-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600/20 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center">
                <ShieldCheck className="text-blue-400" size={28} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/80 leading-none mb-1">Solde Global Sécurisé</span>
                <span className="text-xs font-bold text-slate-400">Calculé en temps réel</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter tabular-nums text-white flex items-baseline gap-4">
                {stats.currentBalance.toLocaleString()} <span className="text-2xl font-black text-emerald-400">{stats.currency}</span>
              </h1>
              
              {/* Multi-currency preview */}
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 pt-4"
              >
                <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 text-slate-300">
                  <Banknote size={16} className="text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-widest opacity-40">Équivalence</span>
                  <span className="text-xl font-black tabular-nums text-emerald-400">
                    {convertedBalance.toLocaleString()} {targetCurrency}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-auto">
            <div className="bg-emerald-500/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-inner group hover:bg-emerald-500/20 transition-all">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                    <TrendingUp size={18} />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60">Volume Ventes</p>
              </div>
              <p className="text-3xl font-black tracking-tight text-emerald-50">{stats.totalSales.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Cumul total enregistré</p>
            </div>
            <div className="bg-blue-500/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-blue-500/20 shadow-inner group hover:bg-blue-500/20 transition-all">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                    <TrendingDown size={18} />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-400/60">Volume Dépenses</p>
              </div>
              <p className="text-3xl font-black tracking-tight text-blue-50">{stats.totalExpenses.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Total des sorties cash</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid Stats */}
      {categories.map((category, catIndex) => (
        <div key={category.label} className="space-y-8">
          <div className="flex items-center gap-4 px-4">
            <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 border border-emerald-400">
              <category.icon size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-black text-foreground tracking-tight">{category.label}</h3>
              <div className="h-1.5 w-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.items.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (catIndex * 3 + index) * 0.1 }}
              >
                <Card className={`group overflow-hidden border-none ${stat.bg} shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-500 rounded-[2.5rem] border ${stat.border}`}>
                  <CardContent className="p-10">
                    <div className="flex items-start justify-between">
                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none">{stat.title}</p>
                        <div className="flex flex-col">
                          <h4 className={`text-4xl font-black ${stat.color} tracking-tighter tabular-nums`}>
                            {stat.amount.toLocaleString()}
                          </h4>
                          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-1">{stats.currency}</span>
                        </div>
                        
                        {/* Sub-conversion for context */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-background/60 dark:bg-card/60 backdrop-blur-sm rounded-xl w-fit border border-border">
                          <ArrowRightLeft size={10} className="text-muted-foreground" />
                          <span className="text-[10px] font-black text-muted-foreground tabular-nums">
                            {convertCurrency(stat.amount, stats.currency, targetCurrency, usdToCdfRate).toLocaleString()} {targetCurrency}
                          </span>
                        </div>
                      </div>
                      <div className={`p-5 rounded-[1.5rem] bg-card dark:bg-slate-800 text-inherit transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm border border-border`}>
                        <stat.icon size={32} strokeWidth={2.5} className={stat.color} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};