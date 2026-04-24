import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Clock, CreditCard, Loader2, MessageCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../../../api/bookings';
import { createCheckoutSession } from '../../../api/payments';
import api from '../../../api/client';
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
  { id: 1, cat: 'shop', name: 'Signature Haircut', price: 20, duration: '45m' },
  { id: 2, cat: 'shop', name: 'Skin Fade', price: 20, duration: '60m' },
  { id: 3, cat: 'shop', name: 'Beard Sculpture', price: 15, duration: '30m' },
  { id: 4, cat: 'shop', name: 'Executive Package', price: 35, duration: '75m' },
  { id: 101, cat: 'home', name: 'Executive Home Visit', price: 40, duration: '60m' },
  { id: 201, cat: 'group', name: 'Father & Son', price: 35, duration: '90m' }
];

const allTimeSlots = [
  '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

type Flow = 'INITIAL' | 'BOOKING' | 'COMPLAINT';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [flow, setFlow] = useState<Flow>('INITIAL');
  const [step, setStep] = useState<any>('INITIAL');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [future, setFuture] = useState<any[]>([]);

  const initialBookingData = {
    category: null,
    service: null,
    date: new Date().toISOString().split('T')[0],
    time: null,
    guestName: '',
    guestEmail: ''
  };

  const initialComplaintData = {
    name: '',
    email: '',
    whatsapp: '',
    message: ''
  };

  const [bookingData, setBookingData] = useState<any>({ ...initialBookingData });
  const [complaintData, setComplaintData] = useState({ ...initialComplaintData });

  const pushToHistory = (s: any, d: any, f: any) => {
    setHistory(prev => [...prev, { step: s, data: JSON.parse(JSON.stringify(d)), flow: f }]);
  };

  const changeStep = (newStep: any, newData?: any) => {
    pushToHistory(step, flow === 'BOOKING' ? bookingData : complaintData, flow);
    setStep(newStep);
    if (newData) {
      if (flow === 'BOOKING') setBookingData(newData);
      else setComplaintData(newData);
    }
    // Clear future when user takes a new path
    setFuture([]);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    
    // Save current to future
    const currentData = flow === 'BOOKING' ? bookingData : complaintData;
    setFuture(prev => [{ step, data: JSON.parse(JSON.stringify(currentData)), flow }, ...prev]);
    
    setHistory(prev => prev.slice(0, -1));
    setStep(last.step);
    setFlow(last.flow);
    if (last.flow === 'BOOKING') setBookingData(last.data);
    else setComplaintData(last.data);
    
    addBotMessage(`Moving back to ${last.step.toLowerCase()} step.`);
  };

  const handleNext = () => {
    if (future.length === 0) return;
    const nextItem = future[0];
    
    pushToHistory(step, flow === 'BOOKING' ? bookingData : complaintData, flow);
    
    setFuture(prev => prev.slice(1));
    setStep(nextItem.step);
    setFlow(nextItem.flow);
    if (nextItem.flow === 'BOOKING') setBookingData(nextItem.data);
    else setComplaintData(nextItem.data);
    
    addBotMessage(`Restoring progress to ${nextItem.step.toLowerCase()} step.`);
  };

  const handleCancel = () => {
    setFlow('INITIAL');
    setStep('INITIAL');
    setHistory([]);
    setFuture([]);
    setBookingData({ ...initialBookingData });
    setComplaintData({ ...initialComplaintData });
    addBotMessage("Session cancelled. What can I do for you now?", ["Book a Session", "Make a Complaint"]);
  };
  
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
      ? `${greeting}, ${user.name.split(' ')[0]}! I'm Baze Assistant. How can I help you today?`
      : `${greeting}! I'm Baze Assistant. Your studio assistant.`;

    addBotMessage(welcomeMsg);
    setTimeout(() => {
      addBotMessage("Would you like to book a session or make a complaint/feedback?", ["Book a Session", "Make a Complaint"]);
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
    
    if (flow === 'INITIAL') {
      if (lowerText.includes('book') || lowerText.includes('session')) {
        setFlow('BOOKING');
        setStep('CATEGORY');
        addBotMessage("Excellent choice. What service category should we explore?", serviceCategories.map(c => c.name));
      } else if (lowerText.includes('complaint') || lowerText.includes('feedback')) {
        setFlow('COMPLAINT');
        if (isLoggedIn && user) {
            setComplaintData(prev => ({ ...prev, name: user.name, email: user.email }));
            setStep('WHATSAPP');
            addBotMessage(`I've noted your profile, ${user.name.split(' ')[0]}. What is your WhatsApp number for follow-up?`);
        } else {
            setStep('NAME');
            addBotMessage("I'm sorry to hear that. Let's make this right. What's your name?");
        }
      } else if (lowerText === 'back') {
        handleBack();
      } else if (lowerText === 'cancel') {
        handleCancel();
      } else {
        addBotMessage("I didn't quite get that. Would you like to Book a Session or Make a Complaint?", ["Book a Session", "Make a Complaint"]);
      }
      return;
    }

    if (flow === 'BOOKING') {
        handleBookingFlow(text);
    } else if (flow === 'COMPLAINT') {
        handleComplaintFlow(text);
    }
  };

  const handleBookingFlow = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText === 'back') { handleBack(); return; }
    if (lowerText === 'cancel') { handleCancel(); return; }
    if (lowerText === 'next' && future.length > 0) { handleNext(); return; }

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
          changeStep('GUEST_EMAIL', { ...bookingData, guestName: text });
          addBotMessage(`Thanks, ${text}. And your email? (For your confirmation)`);
          break;
        case 'GUEST_EMAIL':
          if (!text.includes('@')) {
            addBotMessage("That doesn't look like a valid email. Please try again.");
            return;
          }
          changeStep('CONFIRM', { ...bookingData, guestEmail: text });
          showBookingSummary({ ...bookingData, guestEmail: text });
          break;
      }
  };

  const handleComplaintFlow = (text: string) => {
      const lowerText = text.toLowerCase();
      if (lowerText === 'back') { handleBack(); return; }
      if (lowerText === 'cancel') { handleCancel(); return; }
      if (lowerText === 'next' && future.length > 0) { handleNext(); return; }

      switch (step) {
          case 'NAME':
              changeStep('EMAIL', { ...complaintData, name: text });
              addBotMessage(`Thank you, ${text}. What's your email address?`);
              break;
          case 'EMAIL':
              if (!text.includes('@')) {
                  addBotMessage("Please provide a valid email address.");
                  return;
              }
              changeStep('WHATSAPP', { ...complaintData, email: text });
              addBotMessage("Got it. And your WhatsApp number for feedback?");
              break;
          case 'WHATSAPP':
              changeStep('MESSAGE', { ...complaintData, whatsapp: text });
              addBotMessage("Understood. Please write exactly how you want the message to be sent to the studio executive.");
              break;
          case 'MESSAGE':
              changeStep('CONFIRM', { ...complaintData, message: text });
              addBotMessage(`I have recorded your message. Ready to send it to the manager and send a confirmation to your email?`, ["Send Complaint"]);
              break;
      }
  };

  const handleCategorySelection = (input: string) => {
    const category = serviceCategories.find(c => 
      c.name.toLowerCase().includes(input.toLowerCase()) || 
      input === (serviceCategories.indexOf(c) + 1).toString()
    );

    if (category) {
      changeStep('SERVICE', { ...bookingData, category });
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
      changeStep('DATE', { ...bookingData, service });
      addBotMessage(`${service.name} added. When are we seeing you?`, ['Today', 'Tomorrow', 'Select Another Date']);
    } else {
      addBotMessage("That service isn't in my list. Try typing the name or picking an option.");
    }
  };

  const handleDateSelection = (input: string) => {
    if (input.toLowerCase() === 'select another date') {
      addBotMessage("Please enter your preferred date (e.g., May 15 or 2024-05-15).");
      return;
    }

    let date = "";
    if (input.toLowerCase() === 'today') {
      date = new Date().toISOString().split('T')[0];
    } else if (input.toLowerCase() === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      date = tomorrow.toISOString().split('T')[0];
    } else {
      // Try to parse custom date
      const parsedDate = new Date(input);
      if (isNaN(parsedDate.getTime())) {
          addBotMessage("I didn't recognize that date format. Please use YYYY-MM-DD or try 'Today'/'Tomorrow'.", ['Today', 'Tomorrow', 'Select Another Date']);
          return;
      }
      
      const today = new Date();
      today.setHours(0,0,0,0);
      if (parsedDate < today) {
          addBotMessage("We can't travel back in time! Please select a future date.", ['Today', 'Tomorrow', 'Select Another Date']);
          return;
      }
      date = parsedDate.toISOString().split('T')[0];
    }
    
    // Filter out past times for today
    const isToday = date === new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();
    
    const availableTimeSlots = allTimeSlots.filter(t => {
      if (!isToday) return true;
      const [timeStr, modifier] = t.split(' ');
      let hour = parseInt(timeStr.split(':')[0]);
      if (modifier === 'PM' && hour < 12) hour += 12;
      if (modifier === 'AM' && hour === 12) hour = 0;
      return hour > currentHour;
    });

    if (availableTimeSlots.length === 0) {
      addBotMessage(`Looks like we have no available times left for ${date}. Please select another day.`, ['Tomorrow', 'Select Another Date']);
      // Note: step remains 'DATE' so user can pick another date
    } else {
      changeStep('TIME', { ...bookingData, date });
      addBotMessage(`Seeing you on ${date}. What time works?`, availableTimeSlots);
    }
  };

  const handleTimeSelection = (input: string) => {
    const time = allTimeSlots.find(t => t.toLowerCase() === input.toLowerCase() || input === (allTimeSlots.indexOf(t) + 1).toString());
    
    if (time) {
      if (isLoggedIn) {
        changeStep('CONFIRM', { ...bookingData, time });
        showBookingSummary({ ...bookingData, time });
      } else {
        changeStep('GUEST_NAME', { ...bookingData, time });
        addBotMessage("Almost there! What's your name?");
      }
    } else {
      addBotMessage("Please select an available time slot.");
    }
  };

  const showBookingSummary = (data: any) => {
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

  const handleComplaintSubmit = async () => {
      setLoading(true);
      const loadToast = toast.loading("Sending your message...");
      try {
          await api.post('/notifications/complaint', complaintData);
          toast.success("Feedback sent. Reviewing now.", { id: loadToast });
          addBotMessage("I've successfully sent your complaint to the manager. A confirmation has been sent to your email.");
          setTimeout(() => {
              addBotMessage("Is there anything else I can help with?", ["Book a Session", "Logout"]);
              setFlow('INITIAL');
          }, 1500);
      } catch (err: any) {
          toast.error("Dispatch ritual failed. Please try later.", { id: loadToast });
      } finally {
          setLoading(false);
      }
  };

  const handleOptionClick = (option: string) => {
    if (option === 'Confirm & Pay') {
      handlePayment();
      return;
    }
    if (option === 'Send Complaint') {
        handleComplaintSubmit();
        return;
    }
    processUserResponse(option);
  };

  return (
    <>
      <button className={`chatbot-trigger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)} title="Chat with BazeBot">
        {isOpen ? <X size={24} /> : <img src="/images/logo.jpeg" alt="Logo" className="chat-trigger-logo" />}
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
                <div className="bot-avatar">
                  <img src="/images/logo.jpeg" alt="Bot Avatar" />
                </div>
                <div>
                  <h3>Baze Assistant</h3>
                  <span>Online | Support Assistant</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>

            <div className="chatbot-body">
              {messages.map((m) => (
                <div key={m.id} className={`message-row ${m.sender}`}>
                  {m.sender === 'bot' && (
                    <div className="mini-bot-avatar">
                      <img src="/images/logo.jpeg" alt="Logo" />
                    </div>
                  )}
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

            <div className="bot-tagline">
              Tip: Type <b>'back'</b> to go back, <b>'next'</b> to restore, or <b>'cancel'</b> to reset.
            </div>

            <form className="chatbot-footer" onSubmit={handleInputSubmit}>
              {loading && <div className="bot-loading-overlay"><Loader2 className="spinning-icon" /></div>}
              
              <div className="chatbot-nav-controls">
                <button type="button" onClick={handleBack} disabled={history.length === 0} title="Back">
                  <Clock size={16} style={{ transform: 'scaleX(-1)' }} />
                </button>
                <button type="button" onClick={handleNext} disabled={future.length === 0} title="Next">
                  <Clock size={16} />
                </button>
                <button type="button" onClick={handleCancel} disabled={flow === 'INITIAL'} className="cancel-btn" title="Cancel">
                  <X size={16} />
                </button>
              </div>

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
                     <Clock size={12} /> History
                  </button>
                  <button onClick={() => { navigate('/dashboard/transactions'); setIsOpen(false); }}>
                     <CreditCard size={12} /> Flows
                  </button>
                  <button onClick={() => setFlow('INITIAL')}>
                     <MessageCircle size={12} /> Feedback
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
