import React, { useState, useEffect, useRef } from 'react';
import { supabase, uploadProductImage } from '../../lib/supabase';
import { Currency, Product } from '../../types/finance';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { 
  PlusCircle, 
  Trash2, 
  Camera, 
  Pencil,
  X,
  CheckCircle2,
  ImageIcon,
  Wallet,
  Layers,
  Search,
  Package,
  Loader2,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

export const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    initial_quantity: '' as string | number, 
    unit_price: '' as string | number,
    currency: 'USD' as Currency,
    image_url: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setProducts((data as any[]) || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, isEdit: boolean = false) => {
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("L'image est trop volumineuse (max 5Mo)");
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Le fichier doit être une image');
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await uploadProductImage(file);
      
      if (imageUrl) {
        if (isEdit) {
          setEditForm(prev => ({ ...prev, image_url: imageUrl }));
        } else {
          setNewProduct(prev => ({ ...prev, image_url: imageUrl }));
        }
        toast.success('Image téléchargée avec succès');
      } else {
        toast.error('Échec du téléchargement. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Erreur lors de l'envoi de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, isEdit);
    }
    e.target.value = '';
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Veuillez vous connecter pour ajouter un produit');
        return;
      }

      const { error } = await supabase
        .from('products')
        .insert([{ 
          name: newProduct.name,
          initial_quantity: Number(newProduct.initial_quantity) || 0,
          unit_price: Number(newProduct.unit_price) || 0,
          currency: newProduct.currency,
          image_url: newProduct.image_url,
          user_id: user.id 
        }]);

      if (error) throw error;
      
      toast.success('Produit ajouté avec succès');
      setIsAdding(false);
      setNewProduct({ name: '', initial_quantity: '', unit_price: '', currency: 'USD', image_url: '' });
      fetchProducts();
    } catch (error: any) {
      toast.error("Erreur lors de l'ajout du produit");
    }
  };

  const handleUpdateProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          ...editForm,
          initial_quantity: Number(editForm.initial_quantity) || 0,
          unit_price: Number(editForm.unit_price) || 0
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Produit mis à jour');
      setEditingId(null);
      fetchProducts();
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Produit supprimé');
      fetchProducts();
    } catch (error: any) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ 
      name: product.name, 
      initial_quantity: product.initial_quantity, 
      unit_price: product.unit_price,
      currency: product.currency,
      image_url: product.image_url
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 lg:space-y-12 pb-safe">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 lg:gap-8 px-1">
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl lg:rounded-[1.8rem] shadow-xl shadow-blue-200 dark:shadow-blue-900/40 flex items-center justify-center text-white ring-4 ring-blue-50 dark:ring-blue-950 shrink-0">
            <Layers size={24} className="lg:size-8" />
          </div>
          <div>
            <h2 className="text-xl lg:text-3xl font-black text-foreground tracking-tight text-left leading-none mb-1 lg:mb-2">Catalogue</h2>
            <p className="text-[9px] lg:text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest text-left">Gestion des articles</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
            <Input 
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-11 h-12 lg:h-14 rounded-xl lg:rounded-2xl bg-card border-border focus:ring-blue-500 font-bold shadow-lg shadow-blue-900/5 dark:shadow-none text-sm"
            />
          </div>
          <Button 
            onClick={() => setIsAdding(!isAdding)} 
            className={`h-12 lg:h-14 px-6 lg:px-8 w-full sm:w-auto rounded-xl lg:rounded-2xl font-black gap-2 transition-all active:scale-95 shadow-xl text-sm lg:text-lg ${
              isAdding 
              ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200 dark:shadow-rose-900/40' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-emerald-900/40'
            }`}
          >
            {isAdding ? <X size={18} className="lg:size-6" /> : <PlusCircle size={18} className="lg:size-6" />}
            {isAdding ? 'Annuler' : 'Ajouter'}
          </Button>
        </div>
      </div>

      {isAdding && (
        <Card className="border-none shadow-2xl shadow-blue-900/10 dark:shadow-blue-900/20 bg-blue-50 dark:bg-blue-500/5 rounded-2xl lg:rounded-[3rem] overflow-hidden animate-in zoom-in-95 duration-500 border border-blue-100 dark:border-blue-900/50">
          <CardHeader className="p-5 lg:p-10 pb-4 lg:pb-6 bg-card/50 dark:bg-card/20 backdrop-blur-sm">
            <CardTitle className="text-lg lg:text-2xl font-black text-foreground text-left flex items-center gap-3 lg:gap-4">
              <div className="p-2.5 lg:p-3 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl lg:rounded-2xl ring-2 lg:ring-4 ring-emerald-50 dark:ring-emerald-950 shadow-sm">
                 <PlusCircle className="text-emerald-600 dark:text-emerald-400" size={24} />
              </div>
              <div>
                <span className="block text-base lg:text-2xl">Nouveau Produit</span>
                <span className="block text-[9px] lg:text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Ajout au catalogue</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 lg:p-10 pt-6 lg:pt-8">
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
              <div className="space-y-2 lg:space-y-3">
                <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 ml-1 block">Désignation</label>
                <Input 
                  required
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Ex: Sac de Ciment"
                  className="h-12 lg:h-14 rounded-xl lg:rounded-2xl bg-card border-border font-bold focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="space-y-2 lg:space-y-3">
                <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 ml-1 block">Stock Initial</label>
                <Input 
                  type="number"
                  required
                  value={newProduct.initial_quantity}
                  onChange={e => setNewProduct({...newProduct, initial_quantity: e.target.value})}
                  placeholder="0"
                  className="h-12 lg:h-14 rounded-xl lg:rounded-2xl bg-card border-border font-bold focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="space-y-2 lg:space-y-3">
                <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 ml-1 block">Prix & Devise</label>
                <div className="flex gap-2 lg:gap-3">
                  <Input 
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.unit_price}
                    onChange={e => setNewProduct({...newProduct, unit_price: e.target.value})}
                    placeholder="0.00"
                    className="h-12 lg:h-14 rounded-xl lg:rounded-2xl bg-card border-border font-bold focus:ring-blue-500 flex-1 text-sm"
                  />
                  <select 
                    value={newProduct.currency}
                    onChange={e => setNewProduct({...newProduct, currency: e.target.value as Currency})}
                    className="h-12 lg:h-14 rounded-xl lg:rounded-2xl bg-card border border-border font-black text-[9px] lg:text-xs px-3 lg:px-6 focus:ring-blue-500 shadow-sm text-foreground"
                  >
                    <option value="USD">USD</option>
                    <option value="CDF">CDF</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 lg:space-y-3">
                <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 ml-1 block">Photo</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => onFileChange(e, false)}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex items-center gap-3 lg:gap-4">
                  <Button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="h-12 lg:h-14 flex-1 rounded-xl lg:rounded-2xl bg-card border border-dashed border-blue-300 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/10 font-bold text-blue-600 dark:text-blue-400 transition-all gap-2 lg:gap-3 overflow-hidden text-xs"
                  >
                    {isUploading ? <Loader2 className="animate-spin shrink-0" size={16} /> : <Upload className="shrink-0" size={16} />}
                    <span className="truncate">{newProduct.image_url ? "Changer" : "Importer"}</span>
                  </Button>
                  {newProduct.image_url && (
                    <div className="w-10 h-10 lg:w-14 lg:h-14 shrink-0 rounded-lg lg:rounded-2xl overflow-hidden border border-blue-100 dark:border-blue-900 shadow-md">
                      <img src={newProduct.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-4 border-t border-border pt-6 lg:pt-10">
                <Button type="submit" className="h-12 lg:h-16 px-8 lg:px-12 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl lg:rounded-2xl shadow-xl shadow-emerald-200 dark:shadow-emerald-900/40 transition-all gap-2 lg:gap-4 text-sm lg:text-lg">
                  <CheckCircle2 size={18} className="lg:size-6" />
                  Enregistrer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-10">
        {loading ? (
          <div className="col-span-full py-24 text-center">
             <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 lg:w-16 lg:h-16 border-4 border-blue-100 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin" />
                <span className="font-black text-muted-foreground uppercase tracking-widest text-[9px] lg:text-xs">Chargement...</span>
             </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full py-24 text-center">
             <div className="flex flex-col items-center gap-6">
                <div className="p-6 lg:p-8 bg-blue-50 dark:bg-blue-500/10 rounded-full">
                   <Package size={48} className="text-blue-200 dark:text-blue-800" />
                </div>
                <div className="max-w-xs mx-auto px-4">
                   <h4 className="text-lg font-black text-foreground mb-2">Aucun produit</h4>
                   <p className="text-muted-foreground font-bold text-xs">Ajoutez votre premier produit.</p>
                </div>
             </div>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="group border-none shadow-xl hover:shadow-2xl hover:shadow-blue-900/10 dark:shadow-slate-900/40 transition-all duration-500 bg-card/90 dark:bg-card/40 backdrop-blur-md rounded-2xl lg:rounded-[2.5rem] overflow-hidden flex flex-col relative border border-border">
              <div className="relative h-44 lg:h-64 bg-muted overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-blue-300 dark:text-blue-700 gap-3 lg:gap-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40">
                    <ImageIcon size={32} className="lg:size-14" />
                    <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest opacity-50">Sans image</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-3 lg:top-6 right-3 lg:right-6 flex flex-col gap-2 lg:gap-3 translate-x-12 group-hover:translate-x-0 transition-transform duration-500 delay-75">
                  <Button size="icon" className="bg-card text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 shadow-xl rounded-lg lg:rounded-2xl h-9 w-9 lg:h-12 lg:w-12 border border-emerald-50 dark:border-emerald-900/50" onClick={() => startEditing(product)}>
                    <Pencil size={16} className="lg:size-5" />
                  </Button>
                  <Button size="icon" className="bg-card text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 shadow-xl rounded-lg lg:rounded-2xl h-9 w-9 lg:h-12 lg:w-12 border border-rose-50 dark:border-rose-900/50" onClick={() => handleDeleteProduct(product.id)}>\
                    <Trash2 size={16} className="lg:size-5" />
                  </Button>
                </div>

                <div className="absolute bottom-3 lg:bottom-6 left-3 lg:left-6 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                   <div className="px-2.5 lg:px-5 py-1 lg:py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-[7px] lg:text-[10px] font-black uppercase tracking-widest rounded-md lg:rounded-xl shadow-lg flex items-center gap-1.5 lg:gap-2">
                     <Layers size={8} className="lg:size-3" />
                     Réf: {product.id.slice(0, 8)}
                   </div>
                </div>
              </div>
              
              <CardContent className="p-5 lg:p-8 flex-1 flex flex-col">
                <div className="mb-4 lg:mb-6">
                  <h3 className="font-black text-sm lg:text-2xl text-foreground line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight leading-tight">{product.name}</h3>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg shadow-sm">
                       <Wallet className="text-emerald-600 dark:text-emerald-400" size={14} />
                    </div>
                    <span className="font-black text-lg lg:text-2xl tabular-nums text-emerald-700 dark:text-emerald-400">
                      {product.unit_price?.toLocaleString()} 
                    </span>
                    <span className="text-[9px] lg:text-xs font-black text-muted-foreground uppercase tracking-widest">{product.currency || 'USD'}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 lg:pt-6 border-t border-border grid grid-cols-2 gap-2 lg:gap-6">
                  <div className="space-y-0.5">
                    <span className="text-[7px] lg:text-[10px] font-black text-blue-400 uppercase tracking-widest block">Stock Initial</span>
                    <p className="font-black text-foreground text-xs lg:text-lg truncate">{product.initial_quantity} <span className="text-[7px] lg:text-[10px] font-bold text-muted-foreground uppercase">Unités</span></p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[7px] lg:text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Prix / Unité</span>
                    <p className="font-black text-emerald-600 dark:text-emerald-400 uppercase text-xs lg:text-lg">{product.currency || 'USD'}</p>
                  </div>
                </div>
              </CardContent>

              {editingId === product.id && (
                <div className="absolute inset-0 bg-card/98 dark:bg-slate-900/98 backdrop-blur-xl z-30 p-5 lg:p-10 flex flex-col justify-center animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-6 lg:mb-10">
                    <div className="flex items-center gap-2 lg:gap-3">
                       <Pencil className="text-emerald-600 dark:text-emerald-400" size={24} />
                       <h4 className="font-black text-sm lg:text-xl text-foreground uppercase tracking-tight">Modification</h4>
                    </div>
                    <Button size="icon" variant="ghost" className="rounded-full bg-muted h-8 w-8 lg:h-10 lg:w-10" onClick={() => setEditingId(null)}>
                       <X size={16} />
                    </Button>
                  </div>
                  <div className="space-y-4 lg:space-y-6 overflow-y-auto max-h-[85%] pr-2">
                    <div className="space-y-1">
                      <label className="text-[8px] lg:text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 ml-1">Nom</label>
                      <Input 
                        value={editForm.name}
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                        className="h-10 lg:h-12 font-black border-border focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 lg:gap-6">
                      <div className="space-y-1">
                        <label className="text-[8px] lg:text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 ml-1">Stock</label>
                        <Input 
                          type="number"
                          value={editForm.initial_quantity ?? ''}
                          onChange={e => setEditForm({...editForm, initial_quantity: e.target.value as any})}
                          className="h-10 lg:h-12 font-black border-border focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] lg:text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 ml-1">Prix</label>
                        <Input 
                          type="number"
                          step="0.01"
                          value={editForm.unit_price ?? ''}
                          onChange={e => setEditForm({...editForm, unit_price: e.target.value as any})}
                          className="h-10 lg:h-12 font-black border-border focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] lg:text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 ml-1 block">Photo</label>
                      <input 
                        type="file" 
                        ref={editFileInputRef}
                        onChange={(e) => onFileChange(e, true)}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="flex items-center gap-3">
                        <Button 
                          type="button"
                          onClick={() => editFileInputRef.current?.click()}
                          disabled={isUploading}
                          className="h-10 lg:h-12 flex-1 rounded-xl bg-card border border-dashed border-blue-300 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/10 font-bold text-blue-600 dark:text-blue-400 transition-all gap-2 overflow-hidden text-xs"
                        >
                          {isUploading ? <Loader2 className="animate-spin shrink-0" size={14} /> : <Camera className="shrink-0" size={14} />}
                          <span className="truncate">Changer la photo</span>
                        </Button>
                        {editForm.image_url && (
                          <div className="w-10 h-10 lg:w-12 lg:h-12 shrink-0 rounded-lg lg:rounded-xl overflow-hidden border border-blue-100 dark:border-blue-900 shadow-md">
                            <img src={editForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 lg:h-14 rounded-lg lg:rounded-2xl mt-4 lg:mt-6 shadow-xl shadow-emerald-200 dark:shadow-emerald-900/40 flex items-center justify-center gap-2 lg:gap-3 text-sm lg:text-base" onClick={() => handleUpdateProduct(product.id)}>
                       <CheckCircle2 size={18} /> Valider
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};