
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Brush, Layers, Users, Sparkles } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brush className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">DrawBit</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 space-y-6 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Collaborate and <span className="text-gradient">Create</span> Together
          </h2>
          <p className="text-lg text-muted-foreground">
            DrawBit is the collaborative whiteboard app that brings your team's ideas to life. Sketch, plan, and brainstorm in real-time, no matter where you are.
          </p>
          <div className="flex space-x-4 pt-4">
            <Link to="/register">
              <Button size="lg" className="rounded-full">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="rounded-full">
                Login
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center animate-slide-up">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl transform rotate-3 scale-105"></div>
            <div className="relative bg-white p-6 rounded-2xl shadow-lg border">
              <div className="bg-gray-50 rounded-xl p-4 mb-4 h-48 flex items-center justify-center">
                <Sparkles className="h-20 w-20 text-primary opacity-40" />
              </div>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-gray-100 rounded"></div>
                  <div className="h-3 w-32 bg-gray-100 rounded"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose DrawBit?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brush className="h-10 w-10 text-primary" />,
                title: "Intuitive Drawing",
                description: "Powerful yet simple tools that feel natural whether you're sketching ideas or creating detailed diagrams."
              },
              {
                icon: <Users className="h-10 w-10 text-primary" />,
                title: "Real-time Collaboration",
                description: "Work together seamlessly with your team as if you're in the same room, with instant updates."
              },
              {
                icon: <Layers className="h-10 w-10 text-primary" />,
                title: "Organize Your Ideas",
                description: "Keep your projects structured with layers, groups, and smart organization features."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brush className="h-6 w-6 text-primary" />
              <span className="font-semibold">DrawBit</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} DrawBit. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
