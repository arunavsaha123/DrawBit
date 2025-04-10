import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Brush,
  Plus,
  Users,
  Star,
  Settings,
  LogOut,
  Clock,
  FolderPlus,
  Trash2
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('user@example.com'); 
  const [isNewAccount, setIsNewAccount] = useState(true);

  useEffect(() => {
    const mockEmail = localStorage.getItem('user-email') || 'user@example.com';
    setUserEmail(mockEmail);

    const savedWhiteboards = JSON.parse(localStorage.getItem('drawbit-whiteboards') || '[]');

    setIsNewAccount(savedWhiteboards.length === 0);

    if (savedWhiteboards.length) {
      const formattedProjects = savedWhiteboards.map((wb: any) => {
        const updatedAt = new Date(wb.updatedAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - updatedAt.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let timeAgo;
        if (diffDays === 0) {
          const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
          if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            timeAgo = diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
          } else {
            timeAgo = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
          }
        } else {
          timeAgo = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        }

        return {
          id: wb.id,
          title: wb.title,
          updatedAt: timeAgo,
          members: 1, // Default to 1 member for now
          starred: wb.starred || false
        };
      });

      setProjects(formattedProjects);
    }
  }, []);

  const getUserInitials = (email: string) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const createNewWhiteboard = (values: z.infer<typeof formSchema>) => {
    const newId = `wb-${Date.now()}`;
    const newProject = {
      id: newId,
      title: values.title,
      updatedAt: "Just now",
      members: 1,
      starred: false
    };

    setProjects([newProject, ...projects]);
    setIsNewAccount(false);

    const savedWhiteboards = JSON.parse(localStorage.getItem('drawbit-whiteboards') || '[]');
    savedWhiteboards.push({
      id: newId,
      title: values.title,
      updatedAt: new Date().toISOString(),
      content: null  
    });
    localStorage.setItem('drawbit-whiteboards', JSON.stringify(savedWhiteboards));

    setOpen(false);
    form.reset();

    toast({
      title: "Whiteboard created",
      description: `"${values.title}" whiteboard has been created.`,
    });

    navigate(`/whiteboard/${newId}`);
  };

  const handleOpenWhiteboard = (id: string) => {
    navigate(`/whiteboard/${id}`);
  };

  const handleDeleteWhiteboard = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);

    if (updatedProjects.length === 0) {
      setIsNewAccount(true);
    }

    const savedWhiteboards = JSON.parse(localStorage.getItem('drawbit-whiteboards') || '[]');
    const filteredWhiteboards = savedWhiteboards.filter((wb: any) => wb.id !== id);
    localStorage.setItem('drawbit-whiteboards', JSON.stringify(filteredWhiteboards));

    toast({
      title: "Whiteboard deleted",
      description: "The whiteboard has been deleted successfully.",
    });
  };

  const toggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, starred: !project.starred } : project
    );
    setProjects(updatedProjects);

    const savedWhiteboards = JSON.parse(localStorage.getItem('drawbit-whiteboards') || '[]');
    const updatedWhiteboards = savedWhiteboards.map((wb: any) => {
      if (wb.id === id) {
        return { ...wb, starred: !wb.starred };
      }
      return wb;
    });
    localStorage.setItem('drawbit-whiteboards', JSON.stringify(updatedWhiteboards));
  };

  const renderNewAccountDashboard = () => {
    return (
      <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-16">
        <Brush className="h-24 w-24 text-primary mb-6" />
        <h2 className="text-4xl font-bold mb-4">Welcome to DrawBit!</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl">
          DrawBit is a powerful whiteboard tool that helps you create, collaborate, and share ideas visually.
          Get started by creating your first whiteboard.
        </p>
        <Button size="lg" onClick={() => setOpen(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Create Your First Whiteboard
        </Button>
      </div>
    );
  };

  const renderExistingAccountDashboard = () => {
    return (
      <>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Your Whiteboards</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Whiteboard
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Whiteboard</DialogTitle>
                <DialogDescription>
                  Give your whiteboard a title to get started.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(createNewWhiteboard)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter whiteboard title..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Create Whiteboard</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            className="border-dashed hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <CardContent className="flex flex-col items-center justify-center h-64">
              <FolderPlus className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Create a new whiteboard</p>
            </CardContent>
          </Card>

          {projects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/whiteboard/${project.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl truncate">{project.title}</CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => toggleStar(e, project.id)}
                    >
                      <Star className={`h-5 w-5 ${project.starred ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => handleDeleteWhiteboard(e, project.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Updated {project.updatedAt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                  <Brush className="h-8 w-8 text-muted-foreground opacity-40" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex -space-x-2">
                  {Array(project.members).fill(0).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center text-xs font-medium"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{project.members} member{project.members !== 1 ? 's' : ''}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brush className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">DrawBit</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitials(userEmail)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-8">
        {isNewAccount ? renderNewAccountDashboard() : renderExistingAccountDashboard()}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Whiteboard</DialogTitle>
            <DialogDescription>
              Give your whiteboard a title to get started.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(createNewWhiteboard)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter whiteboard title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Create Whiteboard</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
