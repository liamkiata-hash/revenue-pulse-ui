import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, TransactionType } from '../../types/finance';
import { formatCurrency } from '../../lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Receipt, Search, FileText } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  type: TransactionType;
  title: string;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, type, title }) => {
  const isSale = type === 'sale';
  const Icon = isSale ? TrendingUp : TrendingDown;
  const mainColor = isSale ? 'text-emerald-600' : 'text-rose-600';
  const bgColor = isSale ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-rose-50 dark:bg-rose-500/10';
  const borderColor = isSale ? 'border-emerald-100 dark:border-emerald-500/20' : 'border-rose-100 dark:border-rose-500/20';

  return (
    <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 bg-white/80 dark:bg-card/40 backdrop-blur-md rounded-2xl lg:rounded-[2.5rem] overflow-hidden border border-border">
      <CardHeader className="p-5 lg:p-8 lg:pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className={`p-2.5 lg:p-3 rounded-xl lg:rounded-2xl ${bgColor} ${mainColor} border ${borderColor}`}>
            <Icon strokeWidth={2.5} className="w-5 h-5 lg:w-6 lg:h-6" />
          </div>
          <div>
            <CardTitle className="text-lg lg:text-xl font-black text-foreground tracking-tight uppercase">{title}</CardTitle>
            <p className="text-[9px] lg:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
              {transactions.length} Opérations enregistrées
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl w-full sm:w-auto">
           <div className="flex-1 sm:w-48 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <input 
                className="w-full bg-transparent pl-9 pr-3 py-2 text-xs font-bold focus:outline-none text-foreground" 
                placeholder="Rechercher..."
              />
           </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-muted-foreground uppercase bg-muted/30 font-black tracking-widest border-y border-border/50">
              <tr>
                <th className="px-8 py-5">Date & Heure</th>
                <th className="px-8 py-5">Description</th>
                {isSale && <th className="px-8 py-5 text-center">Mode</th>}
                <th className="px-8 py-5 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={isSale ? 4 : 3} className="px-8 py-20 text-center text-muted-foreground italic font-bold">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                        <Receipt size={32} className="text-muted-foreground/30" />
                      </div>
                      Aucune {isSale ? 'vente' : 'dépense'} enregistrée.
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap text-muted-foreground font-bold text-xs tabular-nums">
                      {format(new Date(t.date), 'dd MMM yyyy', { locale: fr })}
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-foreground text-sm group-hover:text-blue-600 transition-colors">
                        {t.description}
                      </div>
                    </td>
                    {isSale && (
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          t.payment_method === 'Espèces' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {t.payment_method || 'Espèces'}
                        </span>
                      </td>
                    )}
                    <td className={`px-8 py-6 text-right font-black text-lg tabular-nums ${mainColor}`}>
                      {isSale ? '+' : '-'} {formatCurrency(t.amount, t.currency)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Receipt size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold text-sm italic">Aucune opération</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {transactions.map((t) => (
                <div key={t.id} className="p-5 flex flex-col gap-3 hover:bg-muted/10 active:bg-muted/20 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                        {format(new Date(t.date), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                      <h4 className="font-black text-foreground text-sm leading-tight truncate">{t.description}</h4>
                    </div>
                    <div className={`text-right font-black text-base tabular-nums shrink-0 ${mainColor}`}>
                      {isSale ? '+' : '-'} {formatCurrency(t.amount, t.currency)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    {isSale && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider ${
                        t.payment_method === 'Espèces' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {t.payment_method || 'Espèces'}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground ml-auto">
                      <FileText size={10} />
                      ID: {t.id.slice(0, 8)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};