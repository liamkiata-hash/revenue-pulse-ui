import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Currency, Product } from '../../types/finance';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { 
  PlusCircle, 
  MinusCircle, 
  Package, 
  Receipt, 
  Calendar, 
  CreditCard, 
  Wallet2, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { useExchangeRate } from '../../context/ExchangeRateContext';

interface TransactionFormsProps {
  onTransactionAdded: () => void;
  selectedCurrency: Currency;
}

export const TransactionForms: React.FC<TransactionFormsProps> = ({ 
  onTransactionAdded,
  selectedCurrency 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeForm, setActiveForm] = useState<'sale' | 'expense'>('sale');
  const [loading, setLoading] = useState(false);
  const { usdToCdfRate } = useExchangeRate();

  const [saleData, setSaleData] = useState({
    product_id: '',
    quantity: '' as string | number,
    amount: '' as string | number,
    payment_method: 'Espèces',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: '' as string | number,
    date: new Date().toISOString().split('T')[0],
    currency: 'USD' as Currency
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setExpenseData(prev => ({ ...prev, currency: selectedCurrency }));
  }, [selectedCurrency]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setProducts((data as Product[]) || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const qty = Number(saleData.quantity) || 1;
      setSaleData({
        ...saleData,
        product_id: productId,
        description: `Vente de ${product.name}`,
        amount: (product.unit_price || 0) * qty
      });
    } else {
      setSaleData({
        ...saleData,
        product_id: '',
        description: '',
        amount: ''
      });
    }
  };

  const handleQuantityChange = (val: string) => {
    const qty = Number(val);
    const product = products.find(p => p.id === saleData.product_id);
    setSaleData({
      ...saleData,
      quantity: val,
      amount: product ? (product.unit_price || 0) * (qty || 0) : saleData.amount
    });
  };

  const handleSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleData.product_id) {
      toast.error('Veuillez sélectionner un produit');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non trouvé');

      const { error } = await supabase
        .from('transactions')
        .insert([{
          type: 'sale',
          product_id: saleData.product_id,
          quantity: Number(saleData.quantity) || 1,
          amount: Number(saleData.amount),
          payment_method: saleData.payment_method,
          date: saleData.date,
          description: saleData.description,
          user_id: user.id,
          currency: selectedCurrency
        }]);

      if (error) throw error;

      toast.success('Vente enregistrée avec succès');
      setSaleData({
        product_id: '',
        quantity: '',
        amount: '',
        payment_method: 'Espèces',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      onTransactionAdded();
    } catch (error: any) {
      toast.error(`Erreur lors de l'enregistrement : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non trouvé');

      const { error } = await supabase
        .from('transactions')
        .insert([{
          type: 'expense',
          description: expenseData.description,
          amount: Number(expenseData.amount),
          date: expenseData.date,
          user_id: user.id,
          currency: expenseData.currency
        }]);

      if (error) throw error;

      toast.success('Dépense enregistrée avec succès');
      setExpenseData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        currency: selectedCurrency
      });
      onTransactionAdded();
    } catch (error: any) {
      toast.error(`Erreur lors de l'enregistrement : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculatedUsdEquivalent = expenseData.currency === 'USD' 
    ? Number(expenseData.amount)
    : expenseData.currency === 'CDF'
      ? (Number(expenseData.amount) / usdToCdfRate)
      : (Number(expenseData.amount) * 1.09);

  return (
    <div className="space-y-6 lg:space-y-8 py-2 pb-safe">
      <div className="flex flex-row bg-blue-900/10 dark:bg-blue-900/20 p-1.5 rounded-2xl lg:rounded-[2.5rem] w-full border border-blue-200 dark:border-blue-900 shadow-inner backdrop-blur-sm gap-1.5">
        <button
          onClick={() => setActiveForm('sale')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 lg:py-6 rounded-xl lg:rounded-[2rem] font-black transition-all duration-300 ${
            activeForm === 'sale' 
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-xl shadow-blue-200 dark:shadow-blue-900 text-white' 
            : 'text-blue-600/60 dark:text-blue-400/60 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          <PlusCircle size={20} className="shrink-0" />
          <span className="text-xs lg:text-base">Vente</span>
        </button>
        <button
          onClick={() => setActiveForm('expense')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 lg:py-6 rounded-xl lg:rounded-[2rem] font-black transition-all duration-300 ${
            activeForm === 'expense' 
            ? 'bg-gradient-to-r from-rose-600 to-rose-500 shadow-xl shadow-rose-200 dark:shadow-rose-900 text-white' 
            : 'text-rose-600/60 dark:text-rose-400/60 hover:text-rose-600 dark:hover:text-rose-400'
          }`}
        >
          <MinusCircle size={20} className="shrink-0" />
          <span className="text-xs lg:text-base">Dépense</span>
        </button>
      </div>

      <Card className="border-none shadow-2xl shadow-blue-900/10 dark:shadow-slate-900/50 bg-card/80 dark:bg-card/40 backdrop-blur-md rounded-2xl lg:rounded-[3rem] overflow-hidden border border-border">
        <CardHeader className="p-6 lg:p-10 pb-4 lg:pb-6">
          <CardTitle className={`text-xl lg:text-2xl font-black flex items-center gap-4 ${activeForm === 'sale' ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'}`}>
            <div className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl ${activeForm === 'sale' ? 'bg-blue-100/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20' : 'bg-rose-100/50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20'}`}>
              {activeForm === 'sale' ? <Receipt className="w-6 h-6 lg:w-7 lg:h-7" /> : <CreditCard className="w-6 h-6 lg:w-7 lg:h-7" />}
            </div>
            <div>
              <span className="block text-lg lg:text-xl font-black">{activeForm === 'sale' ? 'Nouvelle Vente' : 'Nouvelle Dépense'}</span>
              <span className="text-[10px] lg:text-xs font-bold text-muted-foreground tracking-tight block mt-1 uppercase">
                {activeForm === 'sale' ? `Transaction en ${selectedCurrency}` : 'Opération Sortie de Caisse'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 lg:p-10 pt-0">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full mb-8 lg:mb-10" />
          
          {activeForm === 'sale' ? (
            <form onSubmit={handleSaleSubmit} className="space-y-6 lg:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-10 gap-y-6 lg:gap-y-8">
                <div className="space-y-2 lg:space-y-3">
                  <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 ml-1 block">Produit</label>
                  <div className="relative group">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <select
                      required
                      className="flex h-12 lg:h-14 w-full rounded-xl lg:rounded-2xl border border-border bg-muted/30 pl-11 pr-4 py-2 text-sm font-bold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all appearance-none text-foreground"
                      value={saleData.product_id}
                      onChange={(e) => handleProductChange(e.target.value)}
                    >
                      <option value="">Sélectionner un produit...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.unit_price} {p.currency || 'USD'})</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2 lg:space-y-3">
                  <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 ml-1 block">Quantité</label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={saleData.quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className="h-12 lg:h-14 rounded-xl lg:rounded-2xl bg-muted/30 border-border font-bold focus:ring-blue-500 text-base"
                    placeholder="1"
                  />
                </div>

                <div className="space-y-2 lg:space-y-3">
                  <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 ml-1 block">Montant ({selectedCurrency})</label>
                  <div className="relative group">
                    <Wallet2 className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-300" size={20} />
                    <Input
                      type="number"
                      step="0.01"
                      required
                      value={saleData.amount}
                      onChange={(e) => setSaleData({ ...saleData, amount: e.target.value })}
                      className="h-12 lg:h-14 pl-11 rounded-xl lg:rounded-2xl bg-blue-600 text-white font-black text-xl lg:text-2xl focus:ring-blue-400 shadow-lg shadow-blue-200 dark:shadow-blue-900/40 border-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2 lg:space-y-3">
                  <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 ml-1 block">Méthode</label>
                  <select
                    className="flex h-12 lg:h-14 w-full rounded-xl lg:rounded-2xl border border-border bg-muted/30 px-4 py-2 text-sm font-bold appearance-none focus:ring-blue-500 transition-all text-foreground"
                    value={saleData.payment_method}
                    onChange={(e) => setSaleData({ ...saleData, payment_method: e.target.value })}
                  >
                    <option value="Espèces">Espèces</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Carte">Carte Bancaire</option>
                    <option value="Virement">Virement</option>
                  </select>
                </div>

                <div className="space-y-2 lg:space-y-3">
                  <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 ml-1 block">Date</label>
                  <Input
                    type="date"
                    required
                    value={saleData.date}
                    onChange={(e) => setSaleData({ ...saleData, date: e.target.value })}
                    className="h-12 lg:h-14 rounded-xl lg:rounded-2xl bg-muted/30 border-border font-bold text-sm"
                  />
                </div>

                <div className="space-y-2 lg:space-y-3">
                  <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 ml-1 block">Notes</label>
                  <Input
                    placeholder="Description libre..."
                    value={saleData.description}
                    onChange={(e) => setSaleData({ ...saleData, description: e.target.value })}
                    className="h-12 lg:h-14 rounded-xl lg:rounded-2xl bg-muted/30 border-border font-bold text-sm"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black h-14 lg:h-16 rounded-xl lg:rounded-[1.5rem] transition-all active:scale-95 shadow-xl shadow-blue-200 dark:shadow-blue-900/40 mt-6 lg:mt-8 text-base lg:text-lg gap-3"
              >
                {loading ? 'Traitement...' : <><CheckCircle2 size={22} /> Enregistrer la Vente</>}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleExpenseSubmit} className="space-y-6 lg:space-y-8">
              <div className="space-y-6">
                <div className="space-y-2 lg:space-y-3">
                  <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 ml-1 block">Nature de la dépense</label>
                  <Input
                    required
                    placeholder="Ex: Carburant, Loyer..."
                    value={expenseData.description}
                    onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                    className="h-14 lg:h-16 rounded-xl lg:rounded-2xl bg-muted/30 border-border font-bold focus:ring-rose-500 text-base lg:text-lg"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-2 lg:space-y-3">
                    <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 ml-1 block">Montant & Devise</label>
                    <div className="flex gap-2 lg:gap-3">
                      <Input
                        type="number"
                        step="0.01"
                        required
                        value={expenseData.amount}
                        onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                        className="h-12 lg:h-14 rounded-xl lg:rounded-2xl bg-rose-600 text-white font-black text-xl lg:text-2xl focus:ring-rose-400 flex-1 shadow-lg shadow-rose-200 dark:shadow-rose-900/40 border-none"
                        placeholder="0.00"
                      />
                      <select
                        value={expenseData.currency}
                        onChange={(e) => setExpenseData({ ...expenseData, currency: e.target.value as Currency })}
                        className="h-12 lg:h-14 px-3 lg:px-6 rounded-xl lg:rounded-2xl bg-card border border-border font-black text-[10px] lg:text-xs focus:ring-rose-500 shadow-sm text-foreground"
                      >
                        <option value="USD">USD</option>
                        <option value="CDF">CDF</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 lg:space-y-3">
                    <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 ml-1 block">Date</label>
                    <Input
                      type="date"
                      required
                      value={expenseData.date}
                      onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
                      className="h-12 lg:h-14 rounded-xl lg:rounded-2xl bg-muted/30 border-border font-bold text-sm"
                    />
                  </div>
                </div>

                {expenseData.amount && expenseData.currency !== 'USD' && (
                  <div className="bg-blue-600/10 dark:bg-blue-500/10 p-5 lg:p-6 rounded-2xl lg:rounded-[2rem] border border-blue-200 dark:border-blue-500/20 flex items-center gap-4 lg:gap-6 animate-in fade-in zoom-in duration-300 backdrop-blur-sm">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-card rounded-xl lg:rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                       <ShieldCheck className="text-blue-600 dark:text-blue-400 w-6 h-6 lg:w-7 lg:h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] lg:text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1 truncate">Impact sur le solde USD</p>
                      <div className="flex items-center gap-2 lg:gap-3">
                        <span className="font-bold text-muted-foreground text-xs lg:text-sm truncate">{Number(expenseData.amount).toLocaleString()} {expenseData.currency}</span>
                        <ArrowRight size={12} className="text-blue-300 shrink-0" />
                        <span className="font-black text-blue-700 dark:text-blue-400 text-lg lg:text-xl whitespace-nowrap">-{calculatedUsdEquivalent.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD</span>
                      </div>
                    </div>
                    <Info className="text-blue-400 hidden sm:block" size={20} />
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-black h-14 lg:h-16 rounded-xl lg:rounded-[1.5rem] transition-all active:scale-95 shadow-xl shadow-rose-200 dark:shadow-rose-900/40 mt-6 lg:mt-8 text-base lg:text-lg gap-3"
              >
                {loading ? 'Traitement...' : <><CheckCircle2 size={22} /> Valider la Dépense</>}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};