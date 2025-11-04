import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Zap, Maximize2, Minimize2, Sparkles, HelpCircle, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from './common/Button';
import { OperationCard } from './common/OperationCard';
import {
  MockMessage,
  examplePrompts,
  findMatchingPattern,
  defaultResponses
} from '../data/mockAIResponses';
import * as Icons from 'lucide-react';

export function SmartAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MockMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: defaultResponses.greeting,
      timestamp: new Date()
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [processingOperation, setProcessingOperation] = useState(false);
  const [completedOperations, setCompletedOperations] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (customMessage?: string) => {
    const messageText = customMessage || message.trim();
    if (!messageText) return;

    const userMessage: MockMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsThinking(true);
    setShowExamples(false);

    setTimeout(() => {
      let response;

      if (/^(hi|hello|hey)/i.test(messageText)) {
        response = { message: defaultResponses.greeting };
      } else if (/help/i.test(messageText)) {
        response = { message: defaultResponses.help };
      } else {
        response = findMatchingPattern(messageText);
        if (!response) {
          response = { message: defaultResponses.unclear };
        }
      }

      const assistantMessage: MockMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        operationCard: response.operationCard
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExampleClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleOperationAction = (messageId: string, operationType: string) => {
    setProcessingOperation(true);
    setCompletedOperations(prev => new Set(prev).add(messageId));

    window.addToast?.({
      type: 'info',
      title: 'Processing Operation',
      message: 'Executing your network operation...',
      duration: 2000
    });

    setTimeout(() => {
      const successMessage: MockMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: getSuccessMessage(operationType),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, successMessage]);
      setProcessingOperation(false);

      window.addToast?.({
        type: 'success',
        title: 'Operation Complete',
        message: 'Your network operation has been successfully executed!',
        duration: 4000
      });
    }, 2000);
  };

  const getSuccessMessage = (operationType: string) => {
    const messages: Record<string, string> = {
      capacity: "Perfect! I've scheduled the capacity scaling operation. Your bandwidth will automatically increase at the specified time and revert when the event concludes. You'll receive notifications before each change.",
      cost: "Excellent! I've applied the cost optimization plan. Your monthly spending will decrease by 23% starting next billing cycle, and all connections will maintain their SLA guarantees. The changes are now active.",
      monitoring: "All systems are operating normally. I'll continue monitoring your connections and will alert you immediately if any metrics fall outside expected ranges.",
      troubleshoot: "Great! I've applied the routing optimization fix. Latency should improve within 2-3 minutes. I'll monitor the connection and confirm once performance returns to normal levels.",
      schedule: "Your connection setup has been initiated. You'll receive updates as the provisioning progresses. Expected completion time is 5-7 business days."
    };
    return messages[operationType] || "Operation completed successfully!";
  };

  const handleResetConversation = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: defaultResponses.greeting,
        timestamp: new Date()
      }
    ]);
    setShowExamples(true);
    setCompletedOperations(new Set());
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  const containerClasses = isExpanded
    ? 'fixed inset-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col'
    : 'absolute bottom-16 right-0 mb-2 w-[440px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[600px]';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 !p-0 shadow-lg !rounded-2xl relative group"
          aria-label="Open AI assistant"
        >
          <Sparkles className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Try Natural Language Commands
          </div>
        </Button>
      )}

      {isOpen && (
        <div className={containerClasses}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">NetBond AI Assistant</h3>
                <p className="text-xs text-gray-600">Natural Language Network Management</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleResetConversation}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label="Reset conversation"
                title="Start new conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className={`flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white ${isExpanded ? 'p-6' : 'p-4'}`}>
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-sm">
                          <Zap className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-700">AI Assistant</span>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                    </div>
                    {msg.operationCard && (
                      <div className="mt-3">
                        <OperationCard
                          card={msg.operationCard}
                          onAction={() => handleOperationAction(msg.id, msg.operationCard!.type)}
                          isProcessing={processingOperation}
                          isCompleted={completedOperations.has(msg.id)}
                        />
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1.5 flex items-center gap-2">
                      <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.role === 'assistant' && msg.operationCard && completedOperations.has(msg.id) && (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="max-w-[85%]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-sm">
                        <Zap className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">AI Assistant</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">Analyzing your request...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showExamples && messages.length === 1 && (
                <div className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <HelpCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">Try these examples:</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {examplePrompts.map((example) => (
                      <button
                        key={example.id}
                        onClick={() => handleExampleClick(example.prompt)}
                        className="flex items-start gap-3 p-3 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all group"
                      >
                        <div className="p-1.5 bg-white rounded-lg group-hover:bg-blue-100 transition-colors shadow-sm">
                          {getIconComponent(example.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-900 mb-1">{example.label}</div>
                          <div className="text-xs text-gray-600 line-clamp-2">{example.prompt}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="max-w-3xl mx-auto">
              <div className="relative flex items-center bg-gray-50 rounded-full border-2 border-gray-200 focus-within:border-blue-400 focus-within:shadow-md transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command in plain English..."
                  className="flex-1 py-3 pl-5 pr-12 bg-transparent border-none focus:outline-none text-sm placeholder:text-gray-400"
                  disabled={isThinking}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!message.trim() || isThinking}
                  className="absolute right-2 p-2.5 rounded-full text-white bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none hover:shadow-xl"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Demo mode with pre-scripted AI responses
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
