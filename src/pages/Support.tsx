"use client";

import React, { useState, useEffect } from 'react';
import TopBar from '../components/Topbar';
import Sidebar from '../components/Sidebar';

// --- SVG ICONS ---
const ChevronDownIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const SearchIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const MailIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const MessageSquareIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const SendIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- Accordion Item Component for FAQ ---
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-4">
        <span className="font-semibold text-gray-800">{question}</span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

// --- MOCK FAQ DATA ---
const faqData = [
  { question: "How do I track my order?", answer: "You can track your order status from the 'My Orders' section in your account dashboard. Once an item is dispatched, you will receive a tracking number via email." },
  { question: "What is your return policy?", answer: "We accept returns within 30 days of receipt, provided the book is in its original condition. Please visit our Shipping & Returns page for detailed instructions on how to initiate a return." },
  { question: "How do I sell my books on BritBooks?", answer: "To sell your books, navigate to the 'Sell Books' section. You can enter the ISBN of your book to get an instant quote. We provide a pre-paid shipping label to send your books to us." },
  { question: "What payment methods do you accept?", answer: "We accept all major credit and debit cards, including Visa, Mastercard, and American Express. We also support payments via PayPal." },
];

// --- MOCK TICKET DATA ---
const mockTickets = [
  {
    id: 'TICKET001',
    subject: 'Order Tracking Issue',
    status: 'Open',
    createdAt: '2025-07-01 01:30 AM',
    messages: [
      { id: 1, sender: 'user', text: 'Hi, I need help tracking my order.', timestamp: '2025-07-01 01:30 AM' },
      { id: 2, sender: 'admin', text: 'Hello! Please provide your order number, and I’ll check the status for you.', timestamp: '2025-07-01 01:32 AM' },
      { id: 3, sender: 'user', text: 'It’s ORDER12345.', timestamp: '2025-07-01 01:33 AM' },
      { id: 4, sender: 'bot', text: 'I’m Grok, your AI assistant. I’ve found your order (ORDER12345). It’s currently in transit and expected to arrive by July 3, 2025. Would you like the tracking link?', timestamp: '2025-07-01 01:34 AM' },
    ],
  },
  {
    id: 'TICKET002',
    subject: 'Return Request',
    status: 'Closed',
    createdAt: '2025-06-30 10:00 AM',
    messages: [
      { id: 1, sender: 'user', text: 'How do I return a book?', timestamp: '2025-06-30 10:00 AM' },
      { id: 2, sender: 'admin', text: 'Please visit our Shipping & Returns page for instructions.', timestamp: '2025-06-30 10:05 AM' },
    ],
  },
];

// --- Support Ticket Sidebar Component ---
const SupportTicketSidebar = ({ isOpen, onClose, onTicketSubmit }) => {
  const [view, setView] = useState('ticketForm'); // ticketForm, ticketList, chat
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'user',
        text: newMessage,
        timestamp: new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      // Simulate bot response (replace with backend API call)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: 'bot',
            text: 'Thanks for your message! An admin will respond soon, or I can assist further. What else can I help with?',
            timestamp: new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
          },
        ]);
      }, 1000);
    }
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (subject.trim() && description.trim()) {
      // Simulate backend API call for ticket creation
      const newTicket = {
        id: `TICKET${mockTickets.length + 1}`.padStart(8, '0'),
        subject,
        status: 'Open',
        createdAt: new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
        messages: [
          {
            id: 1,
            sender: 'bot',
            text: `Ticket created: "${subject}". How can I assist you further? An admin will join shortly.`,
            timestamp: new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
          },
        ],
      };
      onTicketSubmit(newTicket);
      setSelectedTicket(newTicket);
      setMessages(newTicket.messages);
      setView('chat');
      setSubject('');
      setDescription('');
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setMessages(ticket.messages);
    setView('chat');
  };

  const handleViewTickets = () => {
    // Simulate backend API call to fetch tickets
    setView('ticketList');
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">
            {view === 'ticketForm'
              ? 'Create Support Ticket'
              : view === 'ticketList'
              ? 'Your Tickets'
              : 'Support Chat'}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
  
        {view === 'ticketForm' ? (
          <form onSubmit={handleSubmitTicket} className="flex-1 p-4 flex flex-col">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter ticket subject..."
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue..."
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 h-32 resize-none"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Submit Ticket
              </button>
              <button
                type="button"
                onClick={handleViewTickets}
                className="text-blue-600 font-semibold text-sm py-2 px-4 hover:underline"
              >
                View Tickets
              </button>
            </div>
          </form>
        ) : view === 'ticketList' ? (
          <div className="flex-1 p-4 overflow-y-auto">
            <button
              onClick={() => setView('ticketForm')}
              className="text-blue-600 font-semibold text-sm mb-4 hover:underline"
            >
              Back to Create Ticket
            </button>
            <div className="space-y-4">
              {mockTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => handleViewTicket(ticket)}
                  className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <p className="font-semibold text-gray-800">{ticket.subject}</p>
                  <p className="text-sm text-gray-600">Status: {ticket.status}</p>
                  <p className="text-sm text-gray-500">Created: {ticket.createdAt}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
            <div className="flex flex-col h-full relative">
            {/* Header */}
            <div className="p-4">
              <button
                onClick={() => setView('ticketList')}
                className="text-blue-600 font-semibold text-sm mb-2 hover:underline"
              >
                Back to Tickets
              </button>
              <p className="text-sm font-semibold text-gray-800">{selectedTicket?.subject}</p>
            </div>
          
            {/* Scrollable messages */}
            <div className="flex-1 overflow-y-auto p-4 border-t border-gray-200 mb-20"> 
              {/* The mb-20 leaves space for the fixed input */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-red-600 text-white'
                        : message.sender === 'admin'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm font-semibold">
                      {message.sender === 'user'
                        ? 'You'
                        : message.sender === 'admin'
                        ? 'Admin'
                        : 'Grok (Bot)'}
                    </p>
                    <p>{message.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          
            {/* Fixed input at the bottom */}
            <form
              onSubmit={handleSendMessage}
              className="fixed bottom-0 right-0 w-96 p-4 border-t border-gray-200 bg-white flex items-center z-50"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} // for iOS safe area
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                className="bg-red-600 text-white p-3 rounded-r-md hover:bg-red-700 transition-transform hover:scale-105"
              >
                <SendIcon className="w-5 h-4" />
              </button>
            </form>
          </div>
          
        )}
      </div>
    </div>
  );
  
};

// --- Main Help & Support Page Component ---
const HelpAndSupportPage = () => {
  const [activeLink, setActiveLink] = useState('help');
  const [isSupportSidebarOpen, setIsSupportSidebarOpen] = useState(false);
  const [tickets, setTickets] = useState(mockTickets);

  const handleTicketSubmit = (newTicket) => {
    // Simulate backend API call for ticket creation
    console.log('Ticket submitted:', newTicket);
    setTickets((prev) => [...prev, newTicket]);
    // In production, make an API call, e.g.:
    // fetch('/api/tickets', { method: 'POST', body: JSON.stringify(newTicket) })
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        .hero-section {
          background-image: url('https://media.istockphoto.com/id/1315388795/video/flying-through-emerging-digital-structures-blue-loopable-data-network-virtual-reality-quantum.mp4?s=mp4-640x640-is&k=20&c=YOcxqKZzmSRYHCTkzQgtAKAKGC6E1L5QWNB7ecOspnk=');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1;
        }
        .hero-section > * {
          position: relative;
          z-index: 2;
        }
      `}</style>

      <Sidebar activeLink={activeLink} setActiveLink={setActiveLink} />

      <div className="flex-1 flex flex-col ml-64">
        <TopBar />
        <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <header className="hero-section text-white py-16 sm:py-20 animate-on-scroll">
              <div className="max-w-4xl mx-auto px-6 sm:px-8">
                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl font-bold">Help & Support</h1>
                  <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-300">Create a ticket to chat with our support team or Grok, our AI assistant, or browse our FAQs for help.</p>
                  <div className="mt-6 max-w-lg mx-auto">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <SearchIcon className="h-3 w-5" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search our knowledge base..."
                        className="w-full pl-12 pr-4 py-3 border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* FAQ Section */}
            <section className="py-8 bg-gray-50">
              <div className="max-w-4xl mx-auto px-6 sm:px-8">
                <div className="animate-on-scroll mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-sm animate-on-scroll">
                  <div className="space-y-2">
                    {faqData.map((faq, index) => (
                      <FaqItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Us Section */}
            <section className="py-8 bg-gray-50">
              <div className="max-w-4xl mx-auto px-6 sm:px-8">
                <div className="text-center animate-on-scroll">
                  <h2 className="text-2xl font-bold text-gray-800">Still Need Help?</h2>
                  <p className="mt-2 text-gray-600">Our support team is here for you.</p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-sm text-left hover:shadow-lg transition-shadow">
                      <MailIcon className="h-8 w-8 text-red-600 mb-2" />
                      <h3 className="font-bold text-lg">Email Support</h3>
                      <p className="text-sm text-gray-600 mt-1">Get a response within 24 hours.</p>
                      <a href="mailto:support@britbooks.co.uk" className="text-blue-600 font-semibold text-sm mt-2 inline-block hover:underline">support@britbooks.co.uk</a>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm text-left hover:shadow-lg transition-shadow">
                      <MessageSquareIcon className="h-8 w-8 text-red-600 mb-2" />
                      <h3 className="font-bold text-lg">Live Chat</h3>
                      <p className="text-sm text-gray-600 mt-1">Available Mon-Fri, 9am - 5pm GMT.</p>
                      <button
                        onClick={() => setIsSupportSidebarOpen(true)}
                        className="text-blue-600 font-semibold text-sm mt-2 inline-block hover:underline"
                      >
                        Start Chat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <SupportTicketSidebar
        isOpen={isSupportSidebarOpen}
        onClose={() => setIsSupportSidebarOpen(false)}
        onTicketSubmit={handleTicketSubmit}
      />
    </div>
  );
};

export default HelpAndSupportPage;