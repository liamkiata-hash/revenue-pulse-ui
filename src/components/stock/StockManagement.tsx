import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { 
  AlertCircle, 
  CheckCircle2, 
  Box, 
  Plus, 
  Package, 
  Calendar, 
  X, 
  ShoppingCart,
  TrendingUp,
  History,
  Info,
  ChevronRight,
  ArrowRightLeft
} from 'lucide-react';
import { StockStatus, Product } from '../../types/finance';

export const StockManagement: React.FC = () => {
  const [stockData, setStockData] = useState<StockStatus[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    product_id: '',
    quantity: '' as string | number,
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stockRes, productsRes] = await Promise.all([
        supabase.from('stock_management').select('*'),
        supabase.from('products').select('*').order('name')
      ]);

      if (stockRes.error) throw stockRes.error;
      if (productsRes.error) throw productsRes.error;

      setStockData(stockRes.data as StockStatus[] || []);
      setProducts(productsRes.data as Product[] || []);
    } catch (error: any) {
      console.error('Error fetching stock:', error);
      toast.error('Erreur lors du chargement des stocks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.product_id || !newEntry.quantity) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('stock_entries')
        .insert([{
          product_id: newEntry.product_id,
          quantity: Number(newEntry.quantity),
          date: newEntry.date,
          user_id: user.id
        }]);

      if (error) throw error;

      toast.success('Nouvel achat enregistré en stock');
      setIsAddingEntry(false);
      setNewEntry({ product_id: '', quantity: '', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (error: any) {
      toast.error("Erreur lors de l'enregistrement de l'entrée");
    }
  };

  return (
    <div className="space-y-6 lg:space-y-12 pb-safe">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 lg:gap-8 px-1">
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl lg:rounded-[1.8rem] shadow-xl shadow-emerald-200 dark:shadow-emerald-900/40 flex items-center justify-center text-white ring-4 ring-emerald-100 dark:ring-emerald-950 shrink-0">
            <Box size={24} className="lg:size-8" />
          </div>
          <div>
            <h2 className="text-xl lg:text-3xl font-black text-foreground tracking-tight text-left leading-none mb-1 lg:mb-2">Inventaire</h2>
            <div className="flex items-center gap-2">
              <TrendingUp size={10} className="text-emerald-500" />
              <p className="text-[9px] lg:text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest text-left">Gestion des flux</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 w-full md:w-auto">
          <Button 
            onClick={() => setIsAddingEntry(!isAddingEntry)}
            className={`h-12 lg:h-14 px-6 lg:px-8 w-full sm:w-auto rounded-xl lg:rounded-2xl font-black gap-2 shadow-xl transition-all active:scale-95 text-sm lg:text-lg ${
              isAddingEntry 
              ? 'bg-rose-500 text-white shadow-rose-200 dark:shadow-rose-900/40' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-emerald-900/40'
            }`}
          >
            {isAddingEntry ? <X size={18} className="lg:size-6" /> : <Plus size={18} className="lg:size-6" />}
            {isAddingEntry ? 'Annuler' : 'Nouvel Achat'}
          </Button>

          <div className="bg-card/80 dark:bg-card/40 backdrop-blur-sm p-1.5 rounded-xl lg:rounded-2xl border border-border shadow-lg flex items-center gap-1.5 w-full sm:w-auto justify-center">
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400 text-[8px] lg:text-[10px] font-black uppercase tracking-widest shadow-inner">
               <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" /> Critique
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-[8px] lg:text-[10px] font-black uppercase tracking-widest shadow-inner">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Optimal
             </div>
          </div>
        </div>
      </div>

      {isAddingEntry && (
        <Card className="border-none shadow-2xl shadow-emerald-900/10 dark:shadow-emerald-900/20 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl lg:rounded-[3rem] overflow-hidden animate-in slide-in-from-top-4 duration-500 border border-emerald-100 dark:border-emerald-900/50">
          <CardHeader className="p-5 lg:p-10 pb-4 lg:pb-6">
            <CardTitle className="text-lg lg:text-2xl font-black text-emerald-900 dark:text-emerald-400 text-left flex items-center gap-3 lg:gap-4">
              <div className="p-2.5 lg:p-3 bg-card dark:bg-slate-800 rounded-xl lg:rounded-2xl shadow-md ring-2 lg:ring-4 ring-emerald-50 dark:ring-emerald-950">
                <ShoppingCart className="text-emerald-600 dark:text-emerald-400" size={24} />
              </div>
              <div>
                <span className="block text-base lg:text-2xl">Nouvel Achat</span>
                <span className="block text-[9px] lg:text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mt-1">Réapprovisionner le stock</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 lg:p-10 pt-4">
            <form onSubmit={handleAddEntry} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
              <div className="space-y-2 lg:space-y-3">
                <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-emerald-800/60 dark:text-emerald-400/60 ml-1 block">Produit</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={20} />
                  <select
                    required
                    className="flex h-12 lg:h-14 w-full rounded-xl lg:rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-card pl-11 pr-4 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none transition-all text-foreground"
                    value={newEntry.product_id}
                    onChange={(e) => setNewEntry({ ...newEntry, product_id: e.target.value })}
                  >
                    <option value="">Sélectionner un produit...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2 lg:space-y-3">
                <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-emerald-800/60 dark:text-emerald-400/60 ml-1 block">Quantité</label>
                <Input 
                  type="number"
                  required
                  value={newEntry.quantity}
                  onChange={e => setNewEntry({...newEntry, quantity: e.target.value})}
                  placeholder="0"
                  className="h-12 lg:h-14 rounded-xl lg:rounded-2xl bg-card border-emerald-200 dark:border-emerald-800 shadow-sm font-black text-emerald-600 dark:text-emerald-400 text-lg lg:text-xl focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2 lg:space-y-3">
                <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-emerald-800/60 dark:text-emerald-400/60 ml-1 block">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={20} />
                  <Input 
                    type="date"
                    required
                    value={newEntry.date}
                    onChange={e => setNewEntry({...newEntry, date: e.target.value})}
                    className="h-12 lg:h-14 pl-11 rounded-xl lg:rounded-2xl bg-card border-emerald-200 dark:border-emerald-800 shadow-sm font-bold focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>
              <div className="md:col-span-3 flex justify-end gap-4 border-t border-emerald-100 dark:border-emerald-900 pt-6 mt-2 lg:mt-4">
                <Button type="submit" className="h-12 lg:h-16 px-8 lg:px-12 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl lg:rounded-2xl shadow-xl shadow-emerald-200 dark:shadow-emerald-900/40 transition-all text-sm lg:text-lg gap-2 lg:gap-3">
                  <CheckCircle2 size={20} />
                  Confirmer l'achat
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <Card className="overflow-hidden border-none shadow-2xl shadow-slate-200 dark:shadow-slate-900/40 bg-card/90 dark:bg-card/40 backdrop-blur-md rounded-2xl lg:rounded-[3rem] border border-border">
            <div className="p-4 lg:p-8 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-blue-50/50 to-emerald-50/50 dark:from-blue-500/5 dark:to-emerald-500/5 gap-4">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-card rounded-lg border border-border shadow-sm">
                    <History size={16} className="text-blue-500" />
                 </div>
                 <h3 className="font-black text-xs lg:text-base text-foreground uppercase tracking-tight">État du Stock</h3>
               </div>
               <span className="text-[7px] lg:text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-2 lg:px-4 py-1 lg:py-2 rounded-lg lg:rounded-xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm self-end sm:self-auto">{stockData.length} Articles</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0 hidden md:table">
                <thead>
                  <tr className="bg-muted/50 text-[10px] text-muted-foreground font-black uppercase tracking-widest border-b border-border">
                    <th className="px-6 lg:px-10 py-4 lg:py-6">Produit</th>
                    <th className="px-4 lg:px-8 py-4 lg:py-6 text-center">Initial</th>
                    <th className="px-4 lg:px-8 py-4 lg:py-6 text-center text-emerald-600">Entrées</th>
                    <th className="px-4 lg:px-8 py-4 lg:py-6 text-center text-rose-600">Sorties</th>
                    <th className="px-6 lg:px-10 py-4 lg:py-6 text-right">Final</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-10 py-24 text-center text-muted-foreground italic font-bold">Chargement...</td>
                    </tr>
                  ) : stockData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-10 py-24 text-center text-muted-foreground italic font-bold">Aucune donnée</td>
                    </tr>
                  ) : (
                    stockData.map((item) => (
                      <tr key={item.product_id} className={`transition-all duration-300 group ${item.final_stock <= 5 ? 'hover:bg-rose-50/30 dark:hover:bg-rose-500/5' : 'hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5'}`}>
                        <td className="px-6 lg:px-10 py-6 lg:py-8">
                          <div className="flex items-center gap-3 lg:gap-4">
                            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-black shadow-lg border-2 border-background dark:border-slate-800 shrink-0 ${item.final_stock <= 5 ? 'bg-gradient-to-br from-rose-500 to-rose-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
                               {item.product_name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                               <span className={`font-black text-xs lg:text-sm text-foreground block leading-none mb-1 group-hover:${item.final_stock <= 5 ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'} transition-colors uppercase tracking-tight truncate`}>{item.product_name}</span>
                               <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest block">Ref: {item.product_id.slice(0, 8)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-8 py-6 lg:py-8 text-center font-bold text-muted-foreground tabular-nums text-xs lg:text-sm">
                          {item.initial_stock}
                        </td>
                        <td className="px-4 lg:px-8 py-6 lg:py-8 text-center">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[9px] lg:text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 tabular-nums shadow-sm">
                            +{item.total_entries || 0}
                          </span>
                        </td>
                        <td className="px-4 lg:px-8 py-6 lg:py-8 text-center">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[9px] lg:text-[10px] font-black uppercase bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 tabular-nums shadow-sm">
                            -{item.total_sold || 0}
                          </span>
                        </td>
                        <td className="px-6 lg:px-10 py-6 lg:py-8 text-right">
                          <div className="flex flex-col items-end">
                            <div className={`text-xl lg:text-3xl font-black tabular-nums ${item.final_stock <= 5 ? 'text-rose-600 dark:text-rose-400' : 'text-blue-700 dark:text-blue-400'}`}>
                              {item.final_stock}
                            </div>
                            {item.final_stock <= 5 ? (
                              <div className="flex items-center gap-1 text-[8px] font-black uppercase text-rose-500 animate-pulse">
                                <AlertCircle size={8} />
                                Stock Bas!
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-[8px] font-black uppercase text-emerald-600">
                                <CheckCircle2 size={8} />
                                OK
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Mobile View Stock Cards */}
              <div className="md:hidden divide-y divide-border/50">
                {loading ? (
                  <div className="p-12 text-center text-muted-foreground">Chargement...</div>
                ) : stockData.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">Aucun stock</div>
                ) : (
                  stockData.map((item) => (
                    <div key={item.product_id} className="p-5 flex flex-col gap-4 active:bg-muted/20 transition-colors">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg ${item.final_stock <= 5 ? 'bg-gradient-to-br from-rose-500 to-rose-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
                               {item.product_name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                               <h4 className="font-black text-xs text-foreground uppercase tracking-tight truncate leading-tight mb-1">{item.product_name}</h4>
                               <p className="text-[8px] font-bold text-muted-foreground uppercase">REF: {item.product_id.slice(0, 8)}</p>
                            </div>
                         </div>
                         <div className="text-right shrink-0">
                            <p className={`text-2xl font-black tabular-nums leading-none ${item.final_stock <= 5 ? 'text-rose-600' : 'text-blue-600'}`}>{item.final_stock}</p>
                            <p className="text-[8px] font-black uppercase text-muted-foreground mt-1">Dispo</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 bg-muted/30 p-3 rounded-xl border border-border/50">
                         <div className="text-center">
                            <p className="text-[7px] font-black text-muted-foreground uppercase mb-0.5 tracking-widest">Initial</p>
                            <p className="text-xs font-bold">{item.initial_stock}</p>
                         </div>
                         <div className="text-center border-x border-border/50">
                            <p className="text-[7px] font-black text-emerald-600 uppercase mb-0.5 tracking-widest">Entrées</p>
                            <p className="text-xs font-bold text-emerald-600">+{item.total_entries || 0}</p>
                         </div>
                         <div className="text-center">
                            <p className="text-[7px] font-black text-rose-600 uppercase mb-0.5 tracking-widest">Sorties</p>
                            <p className="text-xs font-bold text-rose-600">-{item.total_sold || 0}</p>
                         </div>
                      </div>
                      {item.final_stock <= 5 && (
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-rose-500/10 text-rose-600 rounded-xl border border-rose-500/20">
                           <AlertCircle size={14} className="animate-pulse shrink-0" />
                           <span className="text-[10px] font-black uppercase tracking-wider">Alerte Stock Critique!</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:space-y-8 order-1 lg:order-2">
           <Card className="border-none shadow-2xl shadow-emerald-900/10 dark:shadow-emerald-900/20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-700 text-white rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-8 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10">
                 <Info className="text-emerald-300 mb-4 lg:mb-6" size={28} />
                 <h4 className="text-base lg:text-xl font-black mb-3 lg:mb-4 uppercase tracking-tight">Calcul du Stock</h4>
                 <div className="space-y-3 lg:space-y-4">
                    <div className="bg-white/10 backdrop-blur p-4 rounded-xl lg:rounded-2xl border border-white/10 flex items-center justify-between">
                       <div>
                          <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1">Formule</p>
                          <p className="font-bold text-xs lg:text-sm">Init + Entrées - Sorties</p>
                       </div>
                       <ArrowRightLeft size={16} className="opacity-40" />
                    </div>
                    <p className="text-[10px] lg:text-xs text-emerald-50 font-medium leading-relaxed text-balance">
                       Mise à jour automatique à chaque vente ou achat déclaré.
                    </p>
                 </div>
              </div>
           </Card>

           <div className="p-6 lg:p-8 bg-card/80 dark:bg-card/40 backdrop-blur-md rounded-2xl lg:rounded-[2.5rem] border border-border shadow-xl space-y-4 lg:space-y-6">
              <h4 className="font-black text-foreground uppercase tracking-tight flex items-center gap-2 text-xs lg:text-base">
                 <AlertCircle className="text-rose-500" size={16} />
                 Alertes Stock
              </h4>
              <div className="space-y-3 lg:space-y-4">
                 {stockData.filter(i => i.final_stock <= 5).length === 0 ? (
                   <p className="text-[10px] lg:text-xs text-muted-foreground font-bold italic">Aucune alerte en cours.</p>
                 ) : (
                   stockData.filter(i => i.final_stock <= 5).slice(0, 5).map(item => (
                     <div key={item.product_id} className="flex items-center justify-between p-3.5 lg:p-4 bg-rose-100 dark:bg-rose-500/20 rounded-xl lg:rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-sm">
                        <span className="font-bold text-rose-900 dark:text-rose-400 text-xs lg:text-sm truncate mr-4 uppercase tracking-tight">{item.product_name}</span>
                        <span className="font-black text-rose-600 dark:text-rose-400 bg-card px-2.5 py-1 rounded-lg text-[10px] lg:text-xs shadow-sm whitespace-nowrap">{item.final_stock}</span>
                     </div>
                   ))
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};