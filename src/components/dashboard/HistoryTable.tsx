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
  CheckCircle2,
  Package,
  CreditCard
} from 'lucide-react';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

  const isSale = type === 'sale';

  return (
    <Card className={`border-none shadow-2xl ${isSale ? 'shadow-emerald-900/10 border-emerald-50 dark:border-emerald-900/50' : 'shadow-rose-900/10 border-rose-50 dark:border-rose-900/50'} bg-card/90 dark:bg-card/40 backdrop-blur-md rounded-2xl lg:rounded-[3rem] overflow-hidden border border-border`}>
      <div className={`p-5 lg:p-10 border-b ${isSale ? 'border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-500/5' : 'border-rose-100 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-500/5'} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 lg:gap-6`}>
        <div className="flex items-center gap-4 lg:gap-5">
           <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-[1.5rem] shadow-xl flex items-center justify-center text-white ring-4 ring-background dark:ring-slate-900 ${
             isSale ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-200 dark:shadow-emerald-900/40' : 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-200 dark:shadow-rose-900/40'
           }`}>
             {isSale ? <ArrowUpRight size={24} className="lg:size-8" /> : <ArrowDownRight size={24} className="lg:size-8" />}
           </div>
           <div className="text-left">
             <h3 className={`text-lg lg:text-2xl font-black ${isSale ? 'text-emerald-900 dark:text-emerald-400' : 'text-rose-900 dark:text-rose-400'} tracking-tight leading-none mb-1`}>
               {title}
             </h3>
             <div className="flex items-center gap-2">
                <CheckCircle2 size={10} className={isSale ? 'text-emerald-500' : 'text-rose-500'} />
                <p className="text-[9px] lg:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                  {isSale ? 'Flux entrants' : 'Flux sortants'} • {transactions.length} Opérations
                </p>
             </div>
           </div>
        </div>
        
        <div className={`flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2.5 lg:py-3 bg-card border ${isSale ? 'border-emerald-100 dark:border-emerald-900/50 shadow-emerald-100/50 dark:shadow-emerald-900/20' : 'border-rose-100 dark:border-rose-900/50 shadow-rose-100/50 dark:shadow-rose-900/20'} rounded-xl lg:rounded-2xl shadow-md transition-all hover:scale-105 cursor-default self-end sm:self-auto`}>
          <Calendar size={14} className={isSale ? 'text-emerald-500' : 'text-rose-500'} />
          <span className="text-[8px] lg:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Période Active</span>
        </div>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className={`bg-muted/50 text-muted-foreground uppercase text-[10px] font-black tracking-widest border-b ${isSale ? 'border-emerald-50 dark:border-emerald-900/20' : 'border-rose-50 dark:border-rose-900/20'}`}>
              <th className="px-6 lg:px-10 py-4 lg:py-6">Détails de l'opération</th>
              <th className="px-6 lg:px-10 py-4 lg:py-6 text-center">Date</th>
              {isSale && <th className="px-6 lg:px-10 py-4 lg:py-6 text-center">Qté</th>}
              <th className="px-6 lg:px-10 py-4 lg:py-6 text-right">Montant</th>
              {isSale && <th className="px-6 lg:px-10 py-4 lg:py-6 text-center">Paiement</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={isSale ? 5 : 3} className="px-10 py-24 text-center text-muted-foreground italic font-bold">
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
                  <tr key={t.id} className={`transition-all duration-300 group hover:bg-${isSale ? 'emerald' : 'rose'}-50/30 dark:hover:bg-${isSale ? 'emerald' : 'rose'}-500/5`}>
                    <td className="px-6 lg:px-10 py-6 lg:py-8">
                      <div className="flex items-center gap-3 lg:gap-5">
                        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border ${
                          isSale ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'
                        }`}>
                          {isSale ? <Receipt size={20} className="lg:size-6" /> : <Wallet size={20} className="lg:size-6" />}
                        </div>
                        <div className="text-left">
                          <div className={`font-black text-foreground text-xs lg:text-sm group-hover:${isSale ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} transition-colors uppercase tracking-tight`}>
                            {t.description}
                          </div>
                          <div className="text-[8px] lg:text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                            Ref: {t.id.slice(0, 8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 lg:px-10 py-6 lg:py-8 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold tabular-nums text-xs">
                        {format(new Date(t.date), 'dd MMM yyyy', { locale: fr })}
                      </div>
                    </td>
                    {isSale && (
                      <td className="px-6 lg:px-10 py-6 lg:py-8 text-center">
                        <div className="inline-flex items-center justify-center gap-1.5 px-3 lg:px-4 py-1.5 lg:py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg lg:rounded-xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums border border-emerald-100 dark:border-emerald-500/20 shadow-sm text-xs">
                          {t.quantity || 1} <span className="text-[8px] lg:text-[9px] font-bold opacity-50 uppercase">Unités</span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 lg:px-10 py-6 lg:py-8 text-right">
                      <div className="flex flex-col items-end">
                        <div className={`text-lg lg:text-2xl font-black tabular-nums ${
                          isSale ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {isSale ? '+' : '-'} {t.amount.toLocaleString()} <span className="text-[10px] lg:text-xs font-bold opacity-60 ml-1">{t.currency}</span>
                        </div>
                        {usdEquiv !== null && (
                          <div className={`flex items-center gap-1 text-[8px] lg:text-[9px] font-black uppercase tracking-widest mt-1 transition-opacity ${isSale ? 'text-emerald-500' : 'text-blue-500'}`}>
                            <ArrowRightLeft size={10} />
                            ≈ {usdEquiv.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                          </div>
                        )}
                      </div>
                    </td>
                    {isSale && (
                      <td className="px-6 lg:px-10 py-6 lg:py-8 text-center">
                        <span className="px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg lg:rounded-2xl text-[8px] lg:text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white shadow-lg shadow-emerald-100 dark:shadow-emerald-900/40">
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

      {/* Mobile View List */}
      <div className="md:hidden divide-y divide-border/50 pb-safe">
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground italic font-bold">
            <Search size={32} className="mx-auto mb-4 opacity-20" />
            <p className="text-xs">Aucune transaction enregistrée.</p>
          </div>
        ) : (
          transactions.map((t) => {
            const usdEquiv = getUsdEquivalent(t.amount, t.currency);
            return (
              <div key={t.id} className="p-5 space-y-4 hover:bg-muted/20 active:bg-muted/30 transition-colors shadow-sm bg-card/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border shrink-0 ${
                      isSale ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'
                    }`}>
                      {isSale ? <Receipt size={24} /> : <Wallet size={24} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-black text-foreground text-sm uppercase tracking-tight truncate leading-tight mb-1">{t.description}</h4>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                        {format(new Date(t.date), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-lg font-black tabular-nums ${isSale ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isSale ? '+' : '-'} {t.amount.toLocaleString()} <span className="text-[10px] opacity-60 ml-0.5">{t.currency}</span>
                    </div>
                    {usdEquiv !== null && (
                      <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-0.5">
                        ≈ {usdEquiv.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-1 border-t border-border/20">
                   <div className="flex items-center gap-2">
                      {isSale && (
                        <div className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-[9px] font-black text-emerald-700 uppercase border border-emerald-100">
                          {t.quantity || 1} Qté
                        </div>
                      )}
                      {isSale && (
                        <div className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase shadow-sm">
                          {t.payment_method}
                        </div>
                      )}
                      {!isSale && (
                        <div className="px-2.5 py-1 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-[9px] font-black text-rose-700 uppercase border border-rose-100">
                          Dépense
                        </div>
                      )}
                   </div>
                   <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">REF: {t.id.slice(0, 8)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};