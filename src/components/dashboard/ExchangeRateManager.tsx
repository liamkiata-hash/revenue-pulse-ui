import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
      <Card className="lg:col-span-2 border-none shadow-2xl shadow-emerald-900/5 bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/20 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-emerald-100 dark:border-emerald-900/50">
        <CardContent className="p-8 lg:p-10">
          <div className="flex flex-col md:row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200 dark:shadow-emerald-900/40 ring-4 ring-emerald-50 dark:ring-emerald-950">
                <TrendingUp className="text-white" size={32} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Taux de Change Actuel</h3>
                </div>
                <p className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-baseline gap-3">
                  1 USD <ArrowRightLeft size={18} className="text-emerald-500" /> <span className="text-emerald-600">{usdToCdfRate.toLocaleString()} CDF</span>
                </p>
              </div>
            </div>
            
            <div className="h-12 w-px bg-emerald-100 dark:bg-emerald-900 hidden md:block" />

            <form onSubmit={handleSubmit} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-emerald-100 dark:border-emerald-800 shadow-sm">
              <div className="relative">
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                <Input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-32 h-11 pl-9 border-none bg-transparent font-black text-emerald-700 dark:text-emerald-400 focus-visible:ring-0"
                  placeholder="Taux..."
                />
              </div>
              <Button 
                type="submit" 
                disabled={isUpdating} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 font-black shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20"
              >
                {isUpdating ? <RefreshCw size={18} className="animate-spin" /> : 'Mettre à jour'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-600 rounded-[2.5rem] p-8 lg:p-10 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
        <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-200/60 mb-4">Information</p>
          <p className="text-lg font-bold leading-snug">
            Toutes les transactions sont calculées selon ce taux pour assurer la cohérence de votre balance globale.
          </p>
        </div>
      </div>
    </div>
  );
};