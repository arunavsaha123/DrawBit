import React, { useRef, useState, useEffect } from 'react';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Download, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import jsPDF from 'jspdf';

const inviteFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

const Whiteboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const editorRef = useRef(null);
  const [whiteboard, setWhiteboard] = useState<any>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('user@example.com');

  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const location = useLocation();
  const whiteboardName = location.state?.name || whiteboard?.title || `Whiteboard ${id || 'New'}`;


  useEffect(() => {
    const mockEmail = localStorage.getItem('user-email') || 'user@example.com';
    setUserEmail(mockEmail);
  }, []);

  const getUserInitials = (email: string) => email?.charAt(0).toUpperCase() || 'U';

  const handleBack = () => navigate('/dashboard');

  const handleSave = () => {
    toast({ title: 'Whiteboard saved!', description: 'Your whiteboard was saved successfully.' });
  };

  const handleInviteSubmit = (values: { email: string }) => {
    toast({ title: 'Invitation sent!', description: `Invitation sent to ${values.email}` });
    setInviteDialogOpen(false);
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const exportToImage = async (format: 'png' | 'jpeg' | 'pdf') => {
    const editor = editorRef.current;
    if (!editor) return;

    const shapeIds = editor.getCurrentPageShapeIds();
    if (shapeIds.size === 0) {
      alert('No shapes on the canvas');
      return;
    }

    const { blob } = await editor.toImage([...shapeIds], {
      format,
      background: true,
    });

    if (blob) {
      if (format === 'pdf') {
        const pdf = new jsPDF();
        const imgData = await blobToBase64(blob);
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('whiteboard.pdf');
      } else {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `whiteboard.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
            <h1 className="text-xl font-semibold">
              {whiteboardName}
            </h1>

          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" /> Invite
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Collaborators</DialogTitle>
                  <DialogDescription>
                    Enter the email address of the person you want to invite to collaborate on this whiteboard.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleInviteSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter email address..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Send Invitation</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportToImage('png')}>Export as PNG</DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToImage('jpeg')}>Export as JPG</DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToImage('pdf')}>Export as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
            <Avatar className="h-8 w-8 ml-2">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitials(userEmail)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="flex-1 w-full h-full">
        <Tldraw onMount={handleMount} />
      </div>
    </div>
  );
};

export default Whiteboard;