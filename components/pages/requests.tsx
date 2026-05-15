'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Clock } from 'lucide-react';
import { useLanguage, translations } from '@/contexts/language-context';

interface RequestsPageProps {
  userRole: 'buyer' | 'provider';
  language: 'tr' | 'en';
}

const mockRequests = [
  {
    id: 1,
    title: 'Need React Component Library Design',
    category: 'Design',
    budget: '100-200 Pi',
    status: 'open',
    offers: 5,
    time: '2 hours ago',
    location: 'Remote',
  },
  {
    id: 2,
    title: 'Smart Contract Audit Required',
    category: 'Development',
    budget: '500-1000 Pi',
    status: 'open',
    offers: 3,
    time: '4 hours ago',
    location: 'Remote',
  },
  {
    id: 3,
    title: 'Blog Post Writing - Web3 Topic',
    category: 'Writing',
    budget: '50-100 Pi',
    status: 'in-progress',
    offers: 12,
    time: '1 day ago',
    location: 'Remote',
  },
];

export default function RequestsPage({ userRole, language }: RequestsPageProps) {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold">{t.serviceRequests}</h1>
          {userRole === 'buyer' && (
            <Button size="sm" className="bg-primary text-primary-foreground gap-1">
              <Plus size={16} />
              {t.newRequest}
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {userRole === 'buyer'
            ? t.manageYourServiceRequests
            : t.browseAndOfferServices}
        </p>
      </div>

      <div className="p-4">
        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <Badge variant="outline" className="cursor-pointer bg-primary/10 text-primary border-primary/30 whitespace-nowrap">
            {t.all}
          </Badge>
          <Badge variant="outline" className="cursor-pointer whitespace-nowrap">
            {t.open}
          </Badge>
          <Badge variant="outline" className="cursor-pointer whitespace-nowrap">
            {t.inProgress}
          </Badge>
          <Badge variant="outline" className="cursor-pointer whitespace-nowrap">
            {t.completed}
          </Badge>
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {mockRequests.map((request) => (
            <Card
              key={request.id}
              className="p-4 border-border cursor-pointer hover:bg-card/80 transition-colors"
            >
              <div className="mb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm flex-1">{request.title}</h3>
                  <Badge
                    variant="outline"
                    className={
                      request.status === 'open'
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }
                  >
                    {request.status === 'open' ? t.open : t.inProgress}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{request.category}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock size={14} />
                  {request.time}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin size={14} />
                  {request.location}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{t.budget}</p>
                  <p className="font-bold text-primary">{request.budget}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{t.offers}</p>
                  <p className="font-bold">{request.offers}</p>
                </div>
                {userRole === 'provider' && (
                  <Button size="sm" className="bg-primary text-primary-foreground">
                    {t.offer}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
