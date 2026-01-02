'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Mail, Phone, MessageCircle, User, MailIcon, FileText, Paperclip } from 'lucide-react';
import TopBanner from '@/components/TopBanner';

export default function HelpPage() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Reset form
      setTicketForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "To place an order, simply browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping information and select a payment method to complete your purchase."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards including Visa, Mastercard, and American Express. We also support PayPal and bank transfers for your convenience."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery typically takes 3-5 business days. Express delivery is available for 1-2 business days. Delivery times may vary based on your location and product availability."
    },
    {
      question: "Can I return or exchange an item?",
      answer: "Yes, we offer a 30-day return policy for most items. Items must be in their original condition with tags attached. Please contact our support team to initiate a return or exchange."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a confirmation email with tracking information. You can also log into your account and view your order status in the 'My Orders' section."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. International shipping costs and delivery times vary by destination. Check your cart for specific rates during checkout."
    }
  ];

  return (
    <div className="min-h-screen ">
      <TopBanner/>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button and Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/" 
            className="flex items-center text-gray-700 hover:text-[#EB6426] inline-flex items-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Back to Home</span>
          </Link>
          
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/" className="text-gray-700 hover:text-[#EB6426] inline-flex items-center">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">Help</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to frequently asked questions or contact our support team for personalized assistance.
          </p>
        </div>
       
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <MailIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
            </div>
            <p className="text-gray-600 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
            <Link href="mailto:support@gharsamma.com" className="text-blue-600 hover:text-blue-800 font-medium">
              support@gharsamma.com
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Phone Support</h3>
            </div>
            <p className="text-gray-600 mb-4">Call us Monday to Friday, 9am to 6pm EST.</p>
            <Link href="tel:+9779812345678" className="text-blue-600 hover:text-blue-800 font-medium">
              +977 9812345678
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Live Chat</h3>
            </div>
            <p className="text-gray-600 mb-4">Chat with our support team in real-time.</p>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Start Chat
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="px-6 py-4">
                <button
                  onClick={() => toggleQuestion(index)}
                  className="flex justify-between items-center w-full text-left"
                >
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                      openQuestion === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {openQuestion === index && (
                  <div className="mt-4 pr-8">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Raise a Ticket Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-[#EB6426]" />
              Raise a Support Ticket
            </h2>
            <p className="text-gray-600 mt-2">Submit a detailed support request and our team will assist you promptly.</p>
          </div>
          
          <div className="p-6">
            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-green-800 mb-2">Ticket Submitted Successfully!</h3>
                <p className="text-green-700">We've received your support request and will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={ticketForm.name}
                        onChange={handleTicketChange}
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#EB6426] focus:border-[#EB6426] shadow-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MailIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={ticketForm.email}
                        onChange={handleTicketChange}
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#EB6426] focus:border-[#EB6426] shadow-sm"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={ticketForm.subject}
                    onChange={handleTicketChange}
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#EB6426] focus:border-[#EB6426] shadow-sm"
                    placeholder="Briefly describe your issue"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Issue
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={ticketForm.message}
                    onChange={handleTicketChange}
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#EB6426] focus:border-[#EB6426] shadow-sm"
                    placeholder="Please provide detailed information about your issue..."
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                  <button
                    type="button"
                    className="flex items-center text-gray-600 hover:text-gray-800 font-medium"
                  >
                    <Paperclip className="w-5 h-5 mr-2" />
                    Attach Files
                  </button>
                  <span className="text-sm text-gray-500 ml-4">Optional: Attach screenshots or documents</span>
                </div>
                
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{submitError}</p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-3 bg-[#EB6426] text-white font-medium rounded-lg hover:bg-[#d45a21] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB6426] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Ticket'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-12 text-center bg-blue-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-4">
            Can't find the answer you're looking for? Please contact our customer support team.
          </p>
          <Link 
            href="mailto:support@gharsamma.com"
            className="inline-flex items-center px-4 py-2 bg-[#EB6426] text-white rounded-lg hover:bg-[#d45a21] transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}