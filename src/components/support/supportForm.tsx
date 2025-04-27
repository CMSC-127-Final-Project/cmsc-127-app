'use client';

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Monitor,
  Facebook,
  Twitter,
  Instagram,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

export default function ContactUs() {
  const defaultTab = 'faq';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [expandedFaq, setExpandedFaq] = useState<string | null>('notifications1');

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 mb-4 font-roboto">
        <TabsTrigger value="faq">FAQ</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
      </TabsList>

      <TabsContent value="faq" className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 p-4">
              <FaqItem
                id="password1"
                question="How do I reset my password?"
                answer="To reset your password, go to the Administrator's office and bring an identification card."
                isExpanded={expandedFaq === 'password1'}
                onToggle={() => toggleFaq('password1')}
              />

              <FaqItem
                id="access"
                question="Can I access the app on multiple devices?"
                answer="Yes, you can access the app on multiple devices. Simply log in with your account credentials, and your data will sync across all devices."
                isExpanded={expandedFaq === 'access'}
                onToggle={() => toggleFaq('access')}
              />

              <FaqItem
                id="support"
                question="How do I contact customer support?"
                answer="You can contact customer support by navigating to the Contact tab in the app. You can reach us via email, Facebook, Twitter, or Instagram. Our team will respond to your queries as soon as possible"
                isExpanded={expandedFaq === 'support'}
                onToggle={() => toggleFaq('support')}
              />

              <FaqItem
                id="password2"
                question="How do I change my password?"
                answer="To change your password, click the sidebar and go to Profile and Preferences. Then, navigate to the Security Tab."
                isExpanded={expandedFaq === 'notifications2'}
                onToggle={() => toggleFaq('notifications2')}
              />

              <FaqItem
                id="data"
                question="Is my data safe and private?"
                answer="Yes, we take data security seriously. All your information is encrypted and stored securely according to industry standards."
                isExpanded={expandedFaq === 'data'}
                onToggle={() => toggleFaq('data')}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contact" className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 p-4">
              <ContactOption
                icon={<Monitor className="h-6 w-6" />}
                title="Email: csmcs.upmindanao@up.edu.ph"
              />

              <a href="https://www.facebook.com/csmupmin" target="_blank" rel="noopener noreferrer">
                <ContactOption
                  icon={<Facebook className="h-6 w-6" />}
                  title="Facebook: @csmupmin"
                />
              </a>

              <a href="" target="_blank" rel="noopener noreferrer">
                <ContactOption icon={<Twitter className="h-6 w-6" />} title="Twitter: @csmupmin" />
              </a>

              <a
                href="https://www.instagram.com/upmindanao/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ContactOption
                  icon={<MessageSquare className="h-6 w-6" />}
                  title="Instagram: @upmindanao"
                />
              </a>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
interface FaqItemProps {
  id: string;
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function FaqItem({ id, question, answer, isExpanded, onToggle }: FaqItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button className="w-full p-4 text-left flex items-center justify-between" onClick={onToggle}>
        <span className="font-medium">{question}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 border-t border-gray-200 text-gray-600 text-m">
          <div className="mt-5">{answer}</div>
        </div>
      )}
    </div>
  );
}

interface ContactOptionProps {
  icon: React.ReactNode;
  title: string;
}

function ContactOption({ icon, title }: ContactOptionProps) {
  return (
    <button className="w-full flex gap-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="w-10 h-10 rounded-full flex items-center justify-center">{icon}</div>
      <span className="font-medium">{title}</span>
    </button>
  );
}
