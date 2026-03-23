import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, TransactionType } from '../../types/finance';
import { formatCurrency } from '../../lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Receipt } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  type: TransactionType;
  title: string;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, type, title }) => {
  const isSale = type === 'sale';
  const Icon = isSale ? TrendingUp : TrendingDown;
  const mainColor = isSale ? 'text-emerald-600' : 'text-rose-600';
  const bgColor = isSale ? 'bg-emerald-50' : 'bg-rose-50';
  const borderColor = isSale ? 'border-emerald-100' : 'border-rose-100';

  return (
    <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
      <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${bgColor} ${mainColor}`}>
            <Icon size={24} strokeWidth={2.5} />
          </div>
          <div>
            <CardTitle className="text-xl font-black text-slate-800 tracking-tight uppercase">{title}</CardTitle>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
              {transactions.length} Opérations enregistrées
            </p>
          </div>
        </div>
        <Receipt className="text-slate-100 hidden sm:block" size={40} />
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-50/50 font-black tracking-widest border-y border-slate-50">
              <tr>
                <th className="px-8 py-5">Date & Heure</th>
                <th className="px-8 py-5">Description</th>
                {isSale && <th className="px-8 py-5 text-center">Mode</th>}
                <th className="px-8 py-5 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={isSale ? 4 : 3} className="px-8 py-20 text-center text-slate-400 italic font-bold">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <Receipt size={32} className="text-slate-200" />
                      </div>
                      Aucune {isSale ? 'vente' : 'dépense'} enregistrée.
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap text-slate-500 font-bold text-xs tabular-nums">
                      {format(new Date(t.date), 'dd MMM yyyy', { locale: fr })}
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-800 text-sm group-hover:text-emerald-600 transition-colors">
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
      </CardContent>
    </Card>
  );
};