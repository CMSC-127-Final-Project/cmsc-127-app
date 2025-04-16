import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Monitor } from 'lucide-react';

export default function ContactUs() {
  return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 p-4">
              <ContactOption icon={<Monitor className="h-5 w-5" />} title="Email: csm.colsec@up.edu.ph" />

              <ContactOption icon={<MessageSquare className="h-5 w-5" />} title="Facebook: @UPMiinCSM.helpdesk" />

              <ContactOption icon={<MessageSquare className="h-5 w-5" />} title="Twitter: @UPMiinCSM.helpdesk" />

              <ContactOption icon={<MessageSquare className="h-5 w-5" />} title="Instagram: @UPMiinCSM.helpdesk" />
            </div>
        </CardContent>
      </Card>
  );
}

interface ContactOptionProps {
  icon: React.ReactNode
  title: string
}

function ContactOption({ icon, title }: ContactOptionProps) {
  return (
    <button className="w-full flex gap-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="w-10 h-10 rounded-full flex items-center justify-center">{icon}</div>
      <span className="font-medium">{title}</span>
    </button>
  )
}
