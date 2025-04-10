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
import { Checkbox } from "@/components/ui/checkbox";
import { Brush, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      toast({
        title: "Terms Agreement Required",
        description: "Please agree to the terms of service to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Registration Successful",
        description: "Welcome to DrawBit! Your account has been created.",
      });
      navigate("/dashboard");
    }, 1500);
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
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>
                Start your creative journey with DrawBit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    aria-label="Full Name"
                  />
                </div>
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Password"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Password must be at least 8 characters long.
                  </p>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      privacy policy
                    </Link>
                  </label>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading} aria-label="Sign up">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating your account...
                    </>
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="hidden sm:flex flex-1 bg-gradient-to-bl from-blue-100 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-opacity-10 flex flex-col items-center justify-center p-12">
          <div className="max-w-md text-center space-y-6">
            <h2 className="text-3xl font-bold">Join our creative community</h2>
            <p className="text-muted-foreground">
              Connect with other creators and collaborate on amazing projects together.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white p-4 rounded-lg shadow-sm border h-32 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-primary"></div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border h-32 flex items-center justify-center">
                <div className="h-20 w-20 bg-blue-100 rounded-md transform rotate-45"></div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border h-32 flex items-center justify-center">
                <div className="h-16 w-16 bg-primary/10 rounded-xl"></div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border h-32 flex items-center justify-center">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
