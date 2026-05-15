
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, User, Terminal, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

interface LoginPageProps {
  onLogin: (user: { name: string; role: string }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Required Fields Missing", {
        description: "Please enter your Site ID and Security PIN."
      });
      return;
    }

    setIsLoading(true);
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      onLogin({ name: username, role: 'Site Supervisor' });
      toast.success("Welcome, Supervisor", {
        description: "Access granted to Raksha-Kavach Safety Systems."
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-industrial-slate flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-industrial-yellow p-4 rounded-2xl text-white shadow-xl mb-4">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-industrial-black">RAKSHA-KAVACH</h1>
          <div className="flex items-center gap-2 mt-1">
            <Terminal className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Secure Access Portal</span>
          </div>
        </div>

        <Card className="high-vis-card border-2 border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold">Officer Identification</CardTitle>
            <CardDescription>Enter your credentials to access site audit tools</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-id" className="text-xs font-bold uppercase tracking-wider text-gray-500">Site ID / Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input 
                    id="site-id" 
                    placeholder="e.g. SUPER-2024" 
                    className="pl-10 h-12 border-2 focus-visible:ring-industrial-yellow"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-xs font-bold uppercase tracking-wider text-gray-500">Security PIN</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input 
                    id="pin" 
                    type="password" 
                    placeholder="••••••" 
                    className="pl-10 h-12 border-2 focus-visible:ring-industrial-yellow"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 high-vis-button"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Initialize Session"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-gray-50 flex flex-col items-start p-4 gap-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-amber-700 uppercase">
              <AlertTriangle className="w-3 h-3" />
              Unauthorized access is logged
            </div>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
            © 2024 Industrial Safety Systems v1.0.2
          </p>
        </div>
      </motion.div>
    </div>
  );
}
