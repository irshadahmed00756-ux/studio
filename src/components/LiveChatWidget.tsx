'use client';

import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Live Chat"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </Button>
      </div>
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80">
          <Card className="flex h-[28rem] flex-col shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <div className="flex items-center gap-3">
                 <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">AN</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-base font-headline">Aesthetic Nasra</CardTitle>
                    <p className="text-xs text-muted-foreground">We reply instantly</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto p-4">
              <div className="space-y-4">
                <div className="flex items-end gap-2">
                  <Avatar className="h-8 w-8">
                     <AvatarFallback className="bg-primary text-primary-foreground text-sm">AN</AvatarFallback>
                  </Avatar>
                  <p className="max-w-xs rounded-lg bg-secondary p-3 text-sm">
                    Hello! How can we help you today?
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-2">
              <form className="flex w-full items-center gap-2">
                <Input placeholder="Type a message..." className="flex-grow" />
                <Button type="submit" size="icon" variant="ghost" className="text-accent">
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
