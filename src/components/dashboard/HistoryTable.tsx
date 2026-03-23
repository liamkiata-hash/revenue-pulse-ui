import React from 'react';
import { Transaction } from '../../types/finance';
import { Card } from '../ui/card';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Receipt, 
  Wallet, 
  Calendar, 
  ArrowRightLeft,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useExchangeRate } from '../../context/ExchangeRateContext';

interface HistoryTableProps {
  transactions: Transaction[];
  title: string;
  type: 'sale' | 'expense';
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ transactions, title, type }) => {
  const { usdToCdfRate } = useExchangeRate();

  const getUsdEquivalent = (amount: number, currency: string) => {
    if (currency === 'USD') return null;
    if (currency === 'CDF') return amount / usdToCdfRate;
    if (currency === 'EUR') return amount * 1.09;
    return null;
  };

  return (
    <Card className={`border-none shadow-2xl ${type === 'sale' ? 'shadow-emerald-900/10 border-emerald-50 dark:border-emerald-900/50' : 'shadow-rose-900/10 border-rose-50 dark:border-rose-900/50'} bg-card/90 dark:bg-card/40 backdrop-blur-md rounded-[3rem] overflow-hidden border border-border`}>
      <div className={`p-8 lg:p-10 border-b ${type === 'sale' ? 'border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-500/5' : 'border-rose-100 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-500/5'} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6`}>
        <div className="flex items-center gap-5">
           <div className={`w-16 h-16 rounded-[1.5rem] shadow-xl flex items-center justify-center text-white ring-4 ring-background dark:ring-slate-900 ${
             type === 'sale' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-200 dark:shadow-emerald-900/40' : 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-200 dark:shadow-rose-900/40'
           }`}>
             {type === 'sale' ? <ArrowUpRight size={32} /> : <ArrowDownRight size={32} />}
           </div>
           <div className="text-left">
             <h3 className={`text-2xl font-black ${type === 'sale' ? 'text-emerald-900 dark:text-emerald-400' : 'text-rose-900 dark:text-rose-400'} tracking-tight leading-none mb-1`}>
               {title}
             </h3>
             <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className={type === 'sale' ? 'text-emerald-500' : 'text-rose-500'} />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                  {type === 'sale' ? 'Flux entrants consolidés' : 'Flux sortants consolidés'} • {transactions.length} Opérations
                </p>
             </div>
           </div>
        </div>
        
        <div className={`flex items-center gap-3 px-6 py-3 bg-card border ${type === 'sale' ? 'border-emerald-100 dark:border-emerald-900/50 shadow-emerald-100/50 dark:shadow-emerald-900/20' : 'border-rose-100 dark:border-rose-900/50 shadow-rose-100/50 dark:shadow-rose-900/20'} rounded-2xl shadow-md transition-all hover:scale-105 cursor-default`}>
          <Calendar size={18} className={type === 'sale' ? 'text-emerald-500' : 'text-rose-500'} />
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Période Active</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className={`bg-muted/50 text-muted-foreground uppercase text-[10px] font-black tracking-widest border-b ${type === 'sale' ? 'border-emerald-50 dark:border-emerald-900/20' : 'border-rose-50 dark:border-rose-900/20'}`}>
              <th className="px-10 py-6">Détails de l'opération</th>
              <th className="px-10 py-6">Date</th>
              {type === 'sale' && <th className="px-10 py-6 text-center">Qté</th>}
              <th className="px-10 py-6 text-right">Montant</th>
              {type === 'sale' && <th className="px-10 py-6 text-center">Paiement</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={type === 'sale' ? 5 : 3} className="px-10 py-24 text-center text-muted-foreground italic font-bold">
                   <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-muted rounded-full">
                         <Search size={32} className="text-muted-foreground/20" />
                      </div>
                      <span>Aucune transaction enregistrée dans cette devise.</span>
                   </div>
                </td>
              </tr>
            ) : (
              transactions.map((t) => {
                const usdEquiv = getUsdEquivalent(t.amount, t.currency);
                return (
                  <tr key={t.id} className={`transition-all duration-300 group hover:bg-${type === 'sale' ? 'emerald' : 'rose'}-50/30 dark:hover:bg-${type === 'sale' ? 'emerald' : 'rose'}-500/5`}>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border ${
                          type === 'sale' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'
                        }`}>
                          {type === 'sale' ? <Receipt size={24} /> : <Wallet size={24} />}
                        </div>
                        <div className="text-left">
                          <div className={`font-black text-foreground text-sm group-hover:${type === 'sale' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} transition-colors uppercase tracking-tight`}>
                            {t.description}
                          </div>
                          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                            Ref: {t.id.slice(0, 8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 text-muted-foreground font-bold tabular-nums">
                        {new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    {type === 'sale' && (
                      <td className="px-10 py-8 text-center">
                        <div className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                          {t.quantity || 1} <span className="text-[9px] font-bold opacity-50 uppercase">Unités</span>
                        </div>
                      </td>
                    )}
                    <td className="px-10 py-8 text-right">
                      <div className="flex flex-col items-end">
                        <div className={`text-2xl font-black tabular-nums ${
                          type === 'sale' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {type === 'sale' ? '+' : '-'} {t.amount.toLocaleString()} <span className="text-xs font-bold opacity-60 ml-1">{t.currency}</span>
                        </div>
                        {usdEquiv !== null && (
                          <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest mt-1 transition-opacity ${type === 'sale' ? 'text-emerald-500' : 'text-blue-500'}`}>
                            <ArrowRightLeft size={10} />
                            ≈ {usdEquiv.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                          </div>
                        )}
                      </div>
                    </td>
                    {type === 'sale' && (
                      <td className="px-10 py-8 text-center">
                        <span className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white shadow-lg shadow-emerald-100 dark:shadow-emerald-900/40">
                          {t.payment_method}
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};