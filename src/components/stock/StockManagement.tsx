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
  Info
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
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-2">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[1.8rem] shadow-xl shadow-emerald-200 dark:shadow-emerald-900/40 flex items-center justify-center text-white ring-4 ring-emerald-100 dark:ring-emerald-950">
            <Box size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-foreground tracking-tight text-left leading-none mb-2">Suivi Inventaire</h2>
            <div className="flex items-center gap-2">
              <TrendingUp size={12} className="text-emerald-500" />
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest text-left">Gestion dynamique des flux de stock</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <Button 
            onClick={() => setIsAddingEntry(!isAddingEntry)}
            className={`h-14 px-8 rounded-2xl font-black gap-3 shadow-xl transition-all active:scale-95 text-lg ${
              isAddingEntry 
              ? 'bg-rose-500 text-white shadow-rose-200 dark:shadow-rose-900/40' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-emerald-900/40'
            }`}
          >
            {isAddingEntry ? <X size={24} /> : <Plus size={24} />}
            {isAddingEntry ? 'Annuler' : 'Nouvel Achat'}
          </Button>

          <div className="bg-card/80 dark:bg-card/40 backdrop-blur-sm p-2 rounded-2xl border border-border shadow-lg flex items-center gap-2">
             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest shadow-inner">
               <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" /> Critique
             </div>
             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-inner">
               <div className="w-2 h-2 rounded-full bg-emerald-600" /> Optimal
             </div>
          </div>
        </div>
      </div>

      {isAddingEntry && (
        <Card className="border-none shadow-2xl shadow-emerald-900/10 dark:shadow-emerald-900/20 bg-emerald-50 dark:bg-emerald-500/5 rounded-[3rem] overflow-hidden animate-in slide-in-from-top-4 duration-500 border border-emerald-100 dark:border-emerald-900/50">
          <CardHeader className="p-10 pb-6">
            <CardTitle className="text-2xl font-black text-emerald-900 dark:text-emerald-400 text-left flex items-center gap-4">
              <div className="p-3 bg-card dark:bg-slate-800 rounded-2xl shadow-md ring-4 ring-emerald-50 dark:ring-emerald-950">
                <ShoppingCart className="text-emerald-600 dark:text-emerald-400" size={24} />
              </div>
              <div>
                <span>Réapprovisionnement</span>
                <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mt-1">Ajouter de nouveaux achats au stock</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 pt-4">
            <form onSubmit={handleAddEntry} className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800/60 dark:text-emerald-400/60 ml-1 block">Produit à recharger</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={20} />
                  <select
                    required
                    className="flex h-14 w-full rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-card pl-12 pr-4 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none transition-all text-foreground"
                    value={newEntry.product_id}
                    onChange={(e) => setNewEntry({ ...newEntry, product_id: e.target.value })}
                  >
                    <option value="">Sélectionner un produit...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id} className="text-slate-900">{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800/60 dark:text-emerald-400/60 ml-1 block">Quantité Achetée</label>
                <Input 
                  type="number"
                  required
                  value={newEntry.quantity}
                  onChange={e => setNewEntry({...newEntry, quantity: e.target.value})}
                  placeholder="0"
                  className="h-14 rounded-2xl bg-card border-emerald-200 dark:border-emerald-800 shadow-sm font-black text-emerald-600 dark:text-emerald-400 text-xl focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800/60 dark:text-emerald-400/60 ml-1 block">Date de l'Opération</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={20} />
                  <Input 
                    type="date"
                    required
                    value={newEntry.date}
                    onChange={e => setNewEntry({...newEntry, date: e.target.value})}
                    className="h-14 pl-12 rounded-2xl bg-card border-emerald-200 dark:border-emerald-800 shadow-sm font-bold focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="md:col-span-3 flex justify-end gap-4 border-t border-emerald-100 dark:border-emerald-900 pt-8 mt-4">
                <Button type="submit" className="h-16 px-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 dark:shadow-emerald-900/40 active:scale-95 transition-all text-lg gap-3">
                  <CheckCircle2 size={24} />
                  Confirmer le Rechargement
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="overflow-hidden border-none shadow-2xl shadow-slate-200 dark:shadow-slate-900/40 bg-card/90 dark:bg-card/40 backdrop-blur-md rounded-[3rem] border border-border">
            <div className="p-8 border-b border-border flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-emerald-50/50 dark:from-blue-500/5 dark:to-emerald-500/5">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-card rounded-xl border border-border shadow-sm">
                    <History size={18} className="text-blue-500" />
                 </div>
                 <h3 className="font-black text-foreground uppercase tracking-tight">État de Stock Consolidé</h3>
               </div>
               <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm">Total: {stockData.length} Produits</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-muted/50 text-[10px] text-muted-foreground font-black uppercase tracking-widest border-b border-border">
                    <th className="px-10 py-6">Produit</th>
                    <th className="px-8 py-6 text-center">Initial</th>
                    <th className="px-8 py-6 text-center text-emerald-600 dark:text-emerald-400">Entrées (+)</th>
                    <th className="px-8 py-6 text-center text-rose-600 dark:text-rose-400">Sorties (-)</th>
                    <th className="px-10 py-6 text-right">Stock Final</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-10 py-24 text-center text-muted-foreground italic font-bold">Chargement des données...</td>
                    </tr>
                  ) : stockData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-10 py-24 text-center text-muted-foreground italic font-bold">Aucune donnée de stock disponible</td>
                    </tr>
                  ) : (
                    stockData.map((item) => (
                      <tr key={item.product_id} className={`transition-all duration-300 group ${item.final_stock <= 5 ? 'hover:bg-rose-50/30 dark:hover:bg-rose-500/5' : 'hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5'}`}>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-900/10 border-2 border-background dark:border-slate-800 ${item.final_stock <= 5 ? 'bg-gradient-to-br from-rose-500 to-rose-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
                               {item.product_name.charAt(0)}
                            </div>
                            <div>
                               <span className={`font-black text-foreground block leading-none mb-1 group-hover:${item.final_stock <= 5 ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'} transition-colors uppercase tracking-tight`}>{item.product_name}</span>
                               <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Code: {item.product_id.slice(0, 8)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8 text-center font-bold text-muted-foreground tabular-nums">
                          {item.initial_stock}
                        </td>
                        <td className="px-8 py-8 text-center">
                          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 tabular-nums shadow-sm">
                            +{item.total_entries || 0}
                          </span>
                        </td>
                        <td className="px-8 py-8 text-center">
                          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 tabular-nums shadow-sm">
                            -{item.total_sold || 0}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex flex-col items-end">
                            <div className={`text-3xl font-black tabular-nums ${item.final_stock <= 5 ? 'text-rose-600 dark:text-rose-400' : 'text-blue-700 dark:text-blue-400'}`}>
                              {item.final_stock}
                            </div>
                            {item.final_stock <= 5 ? (
                              <div className="flex items-center gap-1 text-[9px] font-black uppercase text-rose-500 animate-pulse">
                                <AlertCircle size={10} />
                                Réapprovisionner!
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={10} />
                                Disponible
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
           <Card className="border-none shadow-2xl shadow-emerald-900/10 dark:shadow-emerald-900/20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-700 text-white rounded-[2.5rem] p-8 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10">
                 <Info className="text-emerald-300 mb-6" size={32} />
                 <h4 className="text-xl font-black mb-4">Formule de Calcul</h4>
                 <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1">Stock Actuel</p>
                       <p className="font-bold text-sm">Initial + Entrées - Sorties</p>
                    </div>
                    <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                       Le stock est automatiquement mis à jour à chaque vente enregistrée ou achat déclaré.
                    </p>
                 </div>
              </div>
           </Card>

           <div className="p-8 bg-card/80 dark:bg-card/40 backdrop-blur-md rounded-[2.5rem] border border-border shadow-xl space-y-6">
              <h4 className="font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                 <AlertCircle className="text-rose-500" size={18} />
                 Alertes Critiques
              </h4>
              <div className="space-y-4">
                 {stockData.filter(i => i.final_stock <= 5).length === 0 ? (
                   <p className="text-xs text-muted-foreground font-bold italic">Aucune alerte pour le moment.</p>
                 ) : (
                   stockData.filter(i => i.final_stock <= 5).map(item => (
                     <div key={item.product_id} className="flex items-center justify-between p-4 bg-rose-100 dark:bg-rose-500/20 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-sm">
                        <span className="font-bold text-rose-900 dark:text-rose-400 text-sm truncate mr-4">{item.product_name}</span>
                        <span className="font-black text-rose-600 dark:text-rose-400 bg-card px-3 py-1 rounded-lg text-xs shadow-md shadow-rose-900/5 dark:shadow-none">{item.final_stock} restants</span>
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