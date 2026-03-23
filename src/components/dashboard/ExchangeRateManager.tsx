import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import { RefreshCw, TrendingUp, ShieldCheck, ArrowRightLeft, Coins } from 'lucide-react';
import { toast } from 'sonner';

export const ExchangeRateManager: React.FC = () => {
  const { usdToCdfRate, updateExchangeRate } = useExchangeRate();
  const [rate, setRate] = React.useState(usdToCdfRate.toString());
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateExchangeRate(Number(rate));
      toast.success(`Taux d'échange mis à jour : 1 USD = ${rate} CDF`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du taux");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-10">
      <Card className="lg:col-span-2 border-none shadow-2xl shadow-emerald-900/5 bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/20 backdrop-blur-xl rounded-2xl lg:rounded-[2.5rem] overflow-hidden border border-emerald-100 dark:border-emerald-900/50">
        <CardContent className="p-5 lg:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8">
            <div className="flex items-center gap-3 lg:gap-6 w-full md:w-auto">
              <div className="w-10 h-10 lg:w-16 lg:h-16 shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg lg:rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200 dark:shadow-emerald-900/40 ring-4 ring-emerald-50 dark:ring-emerald-950">
                <TrendingUp className="text-white w-5 h-5 lg:w-8 lg:h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={10} className="text-emerald-600" />
                  <h3 className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Taux de Change</h3>
                </div>
                <p className="text-lg lg:text-4xl font-black text-foreground tracking-tight flex items-baseline gap-2 lg:gap-3">
                  1 USD <ArrowRightLeft className="text-emerald-500 w-3 h-3 lg:w-4.5 lg:h-4.5" /> <span className="text-emerald-600">{usdToCdfRate.toLocaleString()} CDF</span>
                </p>
              </div>
            </div>
            
            <div className="h-12 w-px bg-emerald-100 dark:bg-emerald-900 hidden md:block" />

            <form onSubmit={handleSubmit} className="flex items-center gap-2 lg:gap-4 bg-white dark:bg-slate-800 p-1.5 rounded-lg lg:rounded-2xl border border-emerald-100 dark:border-emerald-800 shadow-sm w-full md:w-auto">
              <div className="relative flex-1 md:w-32">
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={14} />
                <Input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="h-9 lg:h-11 pl-9 border-none bg-transparent font-black text-emerald-700 dark:text-emerald-400 focus-visible:ring-0 w-full text-xs lg:text-sm"
                  placeholder="Taux..."
                />
              </div>
              <Button 
                type="submit" 
                disabled={isUpdating} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md lg:rounded-xl px-3 lg:px-6 h-9 lg:h-11 font-black shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 text-[10px] lg:text-sm shrink-0"
              >
                {isUpdating ? <RefreshCw size={14} className="animate-spin" /> : 'Mise à jour'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-600 rounded-2xl lg:rounded-[2.5rem] p-5 lg:p-10 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden group flex items-center">
        <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <div className="relative z-10">
          <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-blue-200/60 mb-2 lg:mb-4">Note Multi-Devise</p>
          <p className="text-xs lg:text-lg font-bold leading-snug">
            Taux utilisé pour la consolidation du solde global.
          </p>
        </div>
      </div>
    </div>
  );
};