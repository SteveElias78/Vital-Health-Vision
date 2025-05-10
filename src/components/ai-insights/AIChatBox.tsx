
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, X, Send } from 'lucide-react';
import { claudeService } from '@/services/ClaudeService';
import { HealthDataCategory } from '@/data/demo/DemoDataService';

interface AIChatBoxProps {
  category: HealthDataCategory;
  onClose: () => void;
  metric?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatBox: React.FC<AIChatBoxProps> = ({ 
  category,
  onClose,
  metric = 'health'
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: `I'm your Vital Health Vision assistant. Ask me about ${category.replace('-', ' ')} ${metric} data.` 
    }
  ]);
  const [input, setInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Process the query with ClaudeService
      const response = await claudeService.processQuery(input, { category });
      
      // Add assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error('Error processing AI query:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error processing your request. Please try again.'
      }]);
    } finally {
      setLoading(false);
      // Focus the input again
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };
  
  // Scroll to bottom of messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Ask questions about {category.replace('-', ' ')} data</h3>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-6 w-6 p-1"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto max-h-[250px] border rounded-md p-2">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted flex items-center">
                <Loader className="h-3 w-3 animate-spin mr-2" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Ask about health trends, correlations, or recommendations..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          disabled={loading}
          className="flex-1"
        />
        <Button 
          size="sm" 
          onClick={sendMessage} 
          disabled={!input.trim() || loading}
        >
          {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2">
        {[
          `What are the key trends in ${category.replace('-', ' ')}?`,
          `Which demographics are most affected?`,
          `What interventions are recommended?`,
          `Which regions have the highest rates?`
        ].map((suggestion, i) => (
          <button 
            key={i}
            onClick={() => {
              setInput(suggestion);
              inputRef.current?.focus();
            }}
            className="text-xs px-3 py-1 bg-muted rounded-full hover:bg-muted/80 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
