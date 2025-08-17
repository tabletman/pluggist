'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, Loader2, MapPin, Clock, Zap, Gift } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  deals?: Deal[];
}

interface Deal {
  id: string;
  business: string;
  offer: string;
  distance: string;
  category: string;
  validUntil: string;
}

interface ChargePalChatProps {
  stationId?: string;
  stationName?: string;
  estimatedChargingTime?: number;
  onDealSelect?: (deal: Deal) => void;
}

export function ChargePalChat({ 
  stationId, 
  stationName = 'Tesla Supercharger - Van Aken',
  estimatedChargingTime = 25,
  onDealSelect 
}: ChargePalChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chargingStartTime, setChargingStartTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(estimatedChargingTime);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        role: 'assistant',
        content: `Hey there! 👋 I'm ChargePal, your charging companion. I see you're charging at ${stationName}. Your estimated charging time is ${estimatedChargingTime} minutes.\n\nWhile you wait, I can:\n• Show you exclusive deals nearby 🎁\n• Play trivia or tell you about the area 🎯\n• Help optimize your charging strategy ⚡\n• Just chat if you're bored! 💬\n\nWhat would you like to do?`,
        timestamp: new Date(),
        deals: [
          {
            id: '1',
            business: 'Subway',
            offer: 'BOGO Footlong with charging receipt',
            distance: '0.2 mi',
            category: 'food',
            validUntil: '2 hours'
          },
          {
            id: '2',
            business: 'Starbucks',
            offer: '20% off any drink',
            distance: '0.1 mi',
            category: 'coffee',
            validUntil: '1 hour'
          },
          {
            id: '3',
            business: 'Target',
            offer: '$5 off $25 purchase',
            distance: '0.3 mi',
            category: 'shopping',
            validUntil: '3 hours'
          }
        ]
      };
      setMessages([welcomeMessage]);
      setChargingStartTime(new Date());
    }
  }, [stationName, estimatedChargingTime, messages.length]);

  // Update charging timer
  useEffect(() => {
    if (chargingStartTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - chargingStartTime.getTime()) / 60000);
        const remaining = Math.max(0, estimatedChargingTime - elapsed);
        setTimeRemaining(remaining);
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [chargingStartTime, estimatedChargingTime]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call to AI API (implement actual API call)
      const response = await fetch('/api/chargepal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          stationId,
          context: {
            chargingTime: timeRemaining,
            location: stationName
          }
        })
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || "I'm here to help! What would you like to know?",
        timestamp: new Date(),
        deals: data.deals
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Oops! I'm having connection issues. But don't worry, I'll be back! In the meantime, check out those deals I showed you earlier.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-green-500/10 to-blue-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-500" />
            <CardTitle>ChargePal AI</CardTitle>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="text-muted-foreground">{stationName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{timeRemaining} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-green-500" />
              <span className="text-green-500">Charging</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.deals && message.deals.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium mb-2">🎁 Available Deals:</p>
                      {message.deals.map((deal) => (
                        <div
                          key={deal.id}
                          className="bg-white/10 rounded-md p-2 cursor-pointer hover:bg-white/20 transition-colors"
                          onClick={() => onDealSelect?.(deal)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{deal.business}</p>
                              <p className="text-sm">{deal.offer}</p>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {deal.distance}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  Valid {deal.validUntil}
                                </Badge>
                              </div>
                            </div>
                            <Gift className="w-4 h-4 text-yellow-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs mt-2 opacity-60">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything or explore deals..."
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setInput("Show me food deals nearby")}
          >
            🍔 Food Deals
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setInput("Play EV trivia")}
          >
            🎯 Trivia
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setInput("Tell me about this area")}
          >
            📍 Local Info
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setInput("Optimize my charging")}
          >
            ⚡ Charging Tips
          </Button>
        </div>
      </div>
    </Card>
  );
}
