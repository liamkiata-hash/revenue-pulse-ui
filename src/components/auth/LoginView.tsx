import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Coins, Mail, Lock, ArrowRight, UserPlus, LogIn, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Format d'email invalide");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Compte créé ! Vous pouvez maintenant vous connecter.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Connexion réussie !");
        onLogin();
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 p-6 relative overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-400/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-10 space-y-4">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-card rounded-[2.5rem] shadow-2xl shadow-blue-900/40 mb-6 relative group"
          >
            <ShieldCheck className="h-12 w-12 text-blue-600 dark:text-blue-400 transition-transform duration-500 group-hover:scale-110" strokeWidth={2.5} />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl shadow-lg border-4 border-card">
               <Coins className="h-5 w-5 text-white" />
            </div>
          </motion.div>
          <h1 className="text-6xl font-black text-white tracking-tighter flex items-center justify-center drop-shadow-lg">
            gestion<span className="text-emerald-300">cash</span>
          </h1>
          <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.5em] mt-2 opacity-80">Solution de Trust Financier Pro</p>
        </div>

        <Card className="shadow-3xl shadow-blue-950/40 border-none rounded-[3.5rem] overflow-hidden bg-card/95 backdrop-blur-3xl border border-white/20">
          <CardHeader className="p-12 pb-6 text-center">
            <CardTitle className="text-3xl font-black text-foreground tracking-tight">
              {isSignUp ? "Nouvel utilisateur" : "Connexion Sécurisée"}
            </CardTitle>
            <p className="text-muted-foreground font-bold text-sm tracking-tight mt-3">
              {isSignUp 
                ? "Créez votre compte de gestion en quelques secondes" 
                : "Accédez à vos données financières confidentielles"}
            </p>
          </CardHeader>
          <CardContent className="p-12 pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 ml-1 block text-left">Email Professionnel</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <Input
                    type="email"
                    placeholder="nom@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-16 pl-14 rounded-2xl bg-muted/30 border-border font-bold focus:ring-blue-500 transition-all text-lg"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 ml-1 block text-left">Mot de passe</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-16 pl-14 rounded-2xl bg-muted/30 border-border font-bold focus:ring-blue-500 transition-all text-lg"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-18 py-8 text-lg font-black uppercase tracking-widest bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-3xl shadow-2xl shadow-blue-200 dark:shadow-blue-900/40 transition-all active:scale-[0.97] flex items-center justify-center gap-4 border-none"
                disabled={loading}
              >
                {loading ? "Vérification..." : isSignUp ? (
                  <><UserPlus size={24} /> Créer mon compte</>
                ) : (
                  <><LogIn size={24} /> Accéder au Dashboard</>
                )}
              </Button>
              
              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]"><span className="bg-card px-6 text-muted-foreground">Authentification</span></div>
              </div>

              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-3 active:scale-95"
              >
                {isSignUp ? "Déjà un compte ? Connectez-vous" : "Pas encore de compte ? S'inscrire"}
                <ArrowRight size={16} />
              </button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-12 flex flex-col items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 shadow-sm">
              <ShieldCheck size={14} className="text-emerald-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Chiffrement de bout en bout actif</span>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100 opacity-60">
             © {new Date().getFullYear()} Gestion Cash • Infrastructure Sécurisée
           </p>
        </div>
      </motion.div>
    </div>
  );
};