import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Brush, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/auth/Firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Success",
        description: "User logged in Successfully",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <Brush className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">DrawBit</span>
            </Link>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="yourname@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading} aria-label="Sign in">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="hidden sm:flex flex-1 bg-gradient-to-br from-purple-100 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-opacity-10 flex flex-col items-center justify-center p-12">
          <div className="max-w-md text-center space-y-6">
            <h2 className="text-3xl font-bold">Transform your ideas into visual masterpieces</h2>
            <p className="text-muted-foreground">
              Unlock your creativity with DrawBit's powerful collaborative whiteboard platform.
            </p>
            <div className="relative h-64 w-64 mx-auto">
              <div className="absolute top-0 left-0 h-48 w-48 bg-purple-200 rounded-2xl transform -rotate-6"></div>
              <div className="absolute bottom-0 right-0 h-48 w-48 bg-blue-200 rounded-2xl transform rotate-12"></div>
              <div className="absolute inset-0 m-auto h-56 w-56 bg-white rounded-2xl shadow-md flex items-center justify-center">
                <Brush className="h-20 w-20 text-primary opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
