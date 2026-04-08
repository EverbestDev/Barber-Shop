import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, ChevronLeft, Calendar, User, Clock, CreditCard, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../../../api/bookings';
import { createCheckoutSession } from '../../../api/payments';
import toast from 'react-hot-toast';
import './ChatBot.css';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: string[];
  type?: 'text' | 'service' | 'time' | 'date' | 'summary' | 'input';
}

const serviceCategories = [
  { id: 'shop', name: 'In-Shop Service' },
  { id: 'home', name: 'Home Service' },
  { id: 'group', name: 'Group & Family' }
];

const allServices = [
  { id: 1, cat: 'shop', name: 'Signature Haircut', price: 35, duration: '45m' },
  { id: 2, cat: 'shop', name: 'Skin Fade', price: 38, duration: '60m' },
  { id: 3, cat: 'shop', name: 'Beard Sculpture', price: 25, duration: '30m' },
  { id: 4, cat: 'shop', name: 'Executive Package', price: 55, duration: '75m' },
  { id: 101, cat: 'home', name: 'Executive Home Visit', price: 85, duration: '60m' },
  { id: 201, cat: 'group', name: 'Father & Son', price: 50, duration: '90m' }
];

const allTimeSlots = [
  '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

type BookingStep = 'CATEGORY' | 'SERVICE' | 'DATE' | 'TIME' | 'GUEST_NAME' | 'GUEST_EMAIL' | 'CONFIRM';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState<BookingStep>('CATEGORY');
  const [bookingData, setBookingData] = useState<any>({
    category: null,
    service: null,
    date: new Date().toISOString().split('T')[0],
    time: null,
    guestName: '',
    guestEmail: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initChat();
    }
  }, [isOpen]);

  useEffect(scrollToBottom, [messages]);

  const initChat = () => {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    if (hour >= 17) greeting = 'Good evening';

    const welcomeMsg = user 
      ? `${greeting}, ${user.name.split(' ')[0]}! I'm BazeBot. Ready for your next transformation?`
      : `${greeting}! I'm BazeBot. I can help you book a session in under a minute.`;

    addBotMessage(welcomeMsg);
    setTimeout(() => {
      addBotMessage("What type of service are you looking for today?", serviceCategories.map(c => c.name));
    }, 800);
  };

  const addBotMessage = (text: string, options?: string[]) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'bot',
      text,
      options
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const text = inputValue.trim();
    setInputValue('');
    processUserResponse(text);
  };

  const processUserResponse = (text: string) => {
    addUserMessage(text);
    
    const lowerText = text.toLowerCase();
    
    if (lowerText === 'previous' || lowerText === 'back') {
      goBack();
      return;
    }

    if (lowerText === 'next') {
      // Potentially move forward if enough data exists, but mostly we wait for selection
      return;
    }

    switch (step) {
      case 'CATEGORY':
        handleCategorySelection(text);
        break;
      case 'SERVICE':
        handleServiceSelection(text);
        break;
      case 'DATE':
        handleDateSelection(text);
        break;
      case 'TIME':
        handleTimeSelection(text);
        break;
      case 'GUEST_NAME':
        setBookingData((prev: any) => ({ ...prev, guestName: text }));
        setStep('GUEST_EMAIL');
        addBotMessage(`Thanks, ${text}. And your email? (For your confirmation)`);
        break;
      case 'GUEST_EMAIL':
        if (!text.includes('@')) {
          addBotMessage("That doesn't look like a valid email. Please try again.");
          return;
        }
        setBookingData((prev: any) => ({ ...prev, guestEmail: text }));
        setStep('CONFIRM');
        showSummary({ ...bookingData, guestEmail: text });
        break;
    }
  };

  const goBack = () => {
    switch (step) {
      case 'SERVICE':
        setStep('CATEGORY');
        addBotMessage("Sure, let's pick a category again.", serviceCategories.map(c => c.name));
        break;
      case 'DATE':
        setStep('SERVICE');
        const services = allServices.filter(s => s.cat === bookingData.category?.id);
        addBotMessage(`Back to services. Which one would you like?`, services.map(s => s.name));
        break;
      case 'TIME':
        setStep('DATE');
        addBotMessage("When would you like to visit us? You can type a date like 'Tomorrow' or pick one below.", ['Today', 'Tomorrow']);
        break;
      case 'GUEST_NAME':
        setStep('TIME');
        addBotMessage("Pick a time that works for you.", allTimeSlots);
        break;
      case 'CONFIRM':
        if (isLoggedIn) {
          setStep('TIME');
          addBotMessage("Pick a time that works for you.", allTimeSlots);
        } else {
          setStep('GUEST_EMAIL');
          addBotMessage("Please provide your email address.");
        }
        break;
    }
  };

  const handleCategorySelection = (input: string) => {
    const category = serviceCategories.find(c => 
      c.name.toLowerCase().includes(input.toLowerCase()) || 
      input === (serviceCategories.indexOf(c) + 1).toString()
    );

    if (category) {
      setBookingData((prev: any) => ({ ...prev, category }));
      setStep('SERVICE');
      const services = allServices.filter(s => s.cat === category.id);
      addBotMessage(`${category.name} chosen. Which treatment do you need?`, services.map(s => s.name));
    } else {
      addBotMessage("I didn't catch that. Please select one of the categories above.");
    }
  };

  const handleServiceSelection = (input: string) => {
    const services = allServices.filter(s => s.cat === bookingData.category?.id);
    const service = services.find(s => 
      s.name.toLowerCase().includes(input.toLowerCase()) || 
      input === (services.indexOf(s) + 1).toString()
    );

    if (service) {
      setBookingData((prev: any) => ({ ...prev, service }));
      setStep('DATE');
      addBotMessage(`${service.name} added. When are we seeing you?`, ['Today', 'Tomorrow']);
    } else {
      addBotMessage("That service isn't in my list. Try typing the name or picking an option.");
    }
  };

  const handleDateSelection = (input: string) => {
    let date = new Date().toISOString().split('T')[0];
    if (input.toLowerCase() === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      date = tomorrow.toISOString().split('T')[0];
    }
    // Simplification for now: take today/tomorrow or raw input
    setBookingData((prev: any) => ({ ...prev, date }));
    setStep('TIME');
    addBotMessage(`Seeing you on ${date}. What time works?`, allTimeSlots);
  };

  const handleTimeSelection = (input: string) => {
    const time = allTimeSlots.find(t => t.toLowerCase() === input.toLowerCase() || input === (allTimeSlots.indexOf(t) + 1).toString());
    
    if (time) {
      setBookingData((prev: any) => ({ ...prev, time }));
      if (isLoggedIn) {
        setStep('CONFIRM');
        showSummary({ ...bookingData, time });
      } else {
        setStep('GUEST_NAME');
        addBotMessage("Almost there! What's your name?");
      }
    } else {
      addBotMessage("Please select an available time slot.");
    }
  };

  const showSummary = (data: any) => {
    const summary = `Perfect! Here's your summary:
    Service: ${data.service.name}
    Date: ${data.date}
    Time: ${data.time}
    Price: £${data.service.price}
    ${!isLoggedIn ? `Guest: ${data.guestName}` : ''}`;

    addBotMessage(summary);
    setTimeout(() => {
      addBotMessage("Ready to secure your spot?", ["Confirm & Pay"]);
    }, 600);
  };

  const handlePayment = async () => {
    setLoading(true);
    const loadToast = toast.loading("Preparing your checkout session...");
    try {
      const [timeStr, modifier] = bookingData.time.split(' ');
      let [hour, min] = timeStr.split(':').map(Number);
      if (modifier === 'PM' && hour < 12) hour += 12;
      if (modifier === 'AM' && hour === 12) hour = 0;
      const formattedTime = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00`;

      const bookingParams = {
        service: bookingData.service.name,
        date: `${bookingData.date}T${formattedTime}`,
        barber: 'Any',
        amount: bookingData.service.price,
        guest_name: !isLoggedIn ? bookingData.guestName : undefined,
        guest_email: !isLoggedIn ? bookingData.guestEmail : undefined
      };

      const newBooking = await createBooking(bookingParams);
      const bookingId = newBooking.id || (newBooking as any)._id;
      
      const { url } = await createCheckoutSession(bookingId);
      if (url) {
        toast.success("Great! Taking you to checkout.", { id: loadToast });
        window.location.href = url;
      }
    } catch (err: any) {
      toast.error("Something went wrong. Please try manual booking.", { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (option: string) => {
    if (option === 'Confirm & Pay') {
      handlePayment();
      return;
    }
    processUserResponse(option);
  };

  return (
    <>
      <button className={`chatbot-trigger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)} title="Chat with BazeBot">
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="chatbot-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="chatbot-header">
              <div className="bot-info">
                <div className="bot-avatar">B</div>
                <div>
                  <h3>BazeBot</h3>
                  <span>Online | Real-time Booking</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>

            <div className="chatbot-body">
              {messages.map((m, idx) => (
                <div key={m.id} className={`message-row ${m.sender}`}>
                  {m.sender === 'bot' && <div className="mini-bot-avatar">B</div>}
                  <div className="message-bubble">
                    <p>{m.text}</p>
                    {m.options && (
                      <div className="message-options">
                        {m.options.map((opt, i) => (
                          <button key={i} onClick={() => handleOptionClick(opt)}>{opt}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="chatbot-footer" onSubmit={handleInputSubmit}>
              {loading && <div className="bot-loading-overlay"><Loader2 className="spinning-icon" /></div>}
              <input 
                type="text" 
                placeholder="Type your response..." 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
              />
              <button type="submit" disabled={!inputValue.trim() || loading}>
                <Send size={18} />
              </button>
            </form>
            
            {isLoggedIn && (
               <div className="bot-quick-links">
                  <button onClick={() => { navigate('/dashboard/history'); setIsOpen(false); }}>
                     <Clock size={12} /> My History
                  </button>
                  <button onClick={() => { navigate('/dashboard/transactions'); setIsOpen(false); }}>
                     <CreditCard size={12} /> Transactions
                  </button>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
