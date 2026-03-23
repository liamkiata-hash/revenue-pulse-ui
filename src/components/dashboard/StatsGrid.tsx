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
    <div className="space-y-6 lg:space-y-10">
      <ExchangeRateManager />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl lg:rounded-[3rem] bg-gradient-to-br from-slate-900 via-[#1E293B] to-[#0F172A] p-6 lg:p-14 text-white shadow-2xl shadow-blue-900/40 border border-slate-800"
      >
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-blue-600/30 rounded-full blur-[60px] lg:blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 lg:w-96 h-64 lg:h-96 bg-emerald-600/20 rounded-full blur-[50px] lg:blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
          <div className="w-full lg:w-auto text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 lg:mb-6">
              <div className="p-2 lg:p-3 bg-blue-600/20 backdrop-blur-md rounded-xl lg:rounded-2xl border border-white/10 flex items-center justify-center">
                <ShieldCheck className="text-blue-400 w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/80 leading-none mb-1">Solde Global Sécurisé</span>
                <span className="text-[9px] lg:text-xs font-bold text-slate-400 uppercase tracking-tighter">Mise à jour instantanée</span>
              </div>
            </div>
            
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter tabular-nums text-white flex flex-wrap items-baseline justify-center lg:justify-start gap-2 lg:gap-4">
                {stats.currentBalance.toLocaleString()} <span className="text-lg lg:text-3xl font-black text-emerald-400">{stats.currency}</span>
              </h1>
              
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center lg:justify-start gap-2 pt-2"
              >
                <div className="flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2 lg:py-3 bg-white/5 backdrop-blur-md rounded-xl lg:rounded-2xl border border-white/5 text-slate-300">
                  <Banknote size={16} className="text-emerald-400 shrink-0" />
                  <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest opacity-40">Équivalence</span>
                  <span className="text-xs lg:text-xl font-black tabular-nums text-emerald-400">
                    {convertedBalance.toLocaleString()} {targetCurrency}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 lg:gap-6 w-full lg:w-auto">
            <div className="bg-emerald-500/10 backdrop-blur-xl p-4 lg:p-8 rounded-2xl lg:rounded-[2.5rem] border border-emerald-500/20 shadow-inner group hover:bg-emerald-500/20 transition-all text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 lg:gap-3 mb-2 lg:mb-4">
                 <div className="p-1.5 lg:p-2 bg-emerald-500/20 rounded-lg lg:rounded-xl text-emerald-400">
                    <TrendingUp size={14} className="lg:size-5" />
                 </div>
                 <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-emerald-400/60">Ventes</p>
              </div>
              <p className="text-lg lg:text-3xl font-black tracking-tight text-emerald-50 truncate">{stats.totalSales.toLocaleString()}</p>
              <p className="hidden sm:block text-[8px] lg:text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Volume cumulé</p>
            </div>
            <div className="bg-blue-500/10 backdrop-blur-xl p-4 lg:p-8 rounded-2xl lg:rounded-[2.5rem] border border-blue-500/20 shadow-inner group hover:bg-blue-500/20 transition-all text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 lg:gap-3 mb-2 lg:mb-4">
                 <div className="p-1.5 lg:p-2 bg-blue-500/20 rounded-lg lg:rounded-xl text-blue-400">
                    <TrendingDown size={14} className="lg:size-5" />
                 </div>
                 <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-blue-400/60">Dépenses</p>
              </div>
              <p className="text-lg lg:text-3xl font-black tracking-tight text-blue-50 truncate">{stats.totalExpenses.toLocaleString()}</p>
              <p className="hidden sm:block text-[8px] lg:text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Sorties cash</p>
            </div>
          </div>
        </div>
      </motion.div>

      {categories.map((category, catIndex) => (
        <div key={category.label} className="space-y-4 lg:space-y-8">
          <div className="flex items-center gap-3 lg:gap-4 px-2">
            <div className="p-2 lg:p-2.5 bg-emerald-500 text-white rounded-lg lg:rounded-xl shadow-lg shadow-emerald-500/20 border border-emerald-400">
              <category.icon size={18} strokeWidth={2.5} className="lg:w-6 lg:h-6" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base lg:text-xl font-black text-foreground tracking-tight">{category.label}</h3>
              <div className="h-1 lg:h-1.5 w-10 lg:w-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            {category.items.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (catIndex * 3 + index) * 0.1 }}
              >
                <Card className={`group overflow-hidden border-none ${stat.bg} shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-500 rounded-2xl lg:rounded-[2.5rem] border ${stat.border}`}>
                  <CardContent className="p-5 lg:p-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3 lg:space-y-4 flex-1 min-w-0">
                        <p className="text-[8px] lg:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none truncate">{stat.title}</p>
                        <div className="flex flex-col">
                          <h4 className={`text-xl lg:text-4xl font-black ${stat.color} tracking-tighter tabular-nums truncate`}>
                            {stat.amount.toLocaleString()}
                          </h4>
                          <span className="text-[9px] lg:text-xs font-black text-muted-foreground uppercase tracking-widest mt-1">{stats.currency}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 px-2 lg:px-3 py-1 lg:py-1.5 bg-background/60 dark:bg-card/60 backdrop-blur-sm rounded-lg lg:rounded-xl w-fit border border-border">
                          <ArrowRightLeft size={10} className="text-muted-foreground shrink-0" />
                          <span className="text-[8px] lg:text-[10px] font-black text-muted-foreground tabular-nums">
                            {convertCurrency(stat.amount, stats.currency, targetCurrency, usdToCdfRate).toLocaleString()} {targetCurrency}
                          </span>
                        </div>
                      </div>
                      <div className={`p-2.5 lg:p-5 rounded-lg lg:rounded-[1.5rem] bg-card dark:bg-slate-800 text-inherit transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm border border-border shrink-0`}>
                        <stat.icon strokeWidth={2.5} className={`${stat.color} w-5 h-5 lg:w-8 lg:h-8`} />
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