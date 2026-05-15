'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, Clock } from 'lucide-react';
import { useLanguage, translations } from '@/contexts/language-context';

interface OffersPageProps {
  userRole: 'buyer' | 'provider';
  language: 'tr' | 'en';
}

const mockOffers = [
  {
    id: 1,
    title: 'React Component Library Design',
    provider: 'Design Masters',
    rating: 4.9,
    reviews: 234,
    price: '150 Pi',
    status: 'pending',
    deliveryTime: '3 days',
    image: '🎨',
  },
  {
    id: 2,
    title: 'Smart Contract Audit',
    provider: 'Blockchain Experts',
    rating: 4.8,
    reviews: 189,
    price: '800 Pi',
    status: 'accepted',
    deliveryTime: '5 days',
    image: '💻',
  },
  {
    id: 3,
    title: 'Content Writing Service',
    provider: 'Creative Writers Co',
    rating: 4.7,
    reviews: 156,
    price: '75 Pi',
    status: 'completed',
    deliveryTime: 'Delivered',
    image: '✍️',
  },
];

export default function OffersPage({ userRole, language }: OffersPageProps) {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <h1 className="text-xl font-bold mb-1">{t.serviceOffers}</h1>
        <p className="text-sm text-muted-foreground">
          {userRole === 'buyer'
            ? t.offersReceivedForRequests
            : t.offersYouSubmitted}
        </p>
      </div>

      <div className="p-4">
        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <Badge variant="outline" className="cursor-pointer bg-primary/10 text-primary border-primary/30 whitespace-nowrap">
            {t.all}
          </Badge>
          <Badge variant="outline" className="cursor-pointer whitespace-nowrap">
            {t.pending}
          </Badge>
          <Badge variant="outline" className="cursor-pointer whitespace-nowrap">
            {t.accepted}
          </Badge>
          <Badge variant="outline" className="cursor-pointer whitespace-nowrap">
            {t.completed}
          </Badge>
        </div>

        {/* Offers List */}
        <div className="space-y-3">
          {mockOffers.map((offer) => (
            <Card
              key={offer.id}
              className="p-4 border-border hover:bg-card/80 transition-colors"
            >
              <div className="flex gap-3 mb-3">
                <div className="text-3xl">{offer.image}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-1">{offer.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{offer.provider}</p>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-primary fill-primary" />
                    <span className="text-xs font-medium">{offer.rating}</span>
                    <span className="text-xs text-muted-foreground">({offer.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t.price}</p>
                  <p className="font-bold text-primary">{offer.price}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t.delivery}</p>
                  <p className="text-xs font-medium">{offer.deliveryTime}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t.status}</p>
                  <Badge
                    variant="outline"
                    className={
                      offer.status === 'pending'
                        ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
                        : offer.status === 'accepted'
                          ? 'text-green-400 border-green-500/30 bg-green-500/10'
                          : 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                    }
                  >
                    {offer.status === 'pending' ? t.pending : offer.status === 'accepted' ? t.accepted : t.completed}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                {userRole === 'buyer' && offer.status === 'pending' && (
                  <>
                    <Button size="sm" className="flex-1 bg-primary text-primary-foreground">
                      {t.acceptOffer}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      {t.decline}
                    </Button>
                  </>
                )}
                {offer.status === 'accepted' && (
                  <Button size="sm" className="flex-1 bg-primary text-primary-foreground">
                    {t.viewProgress}
                  </Button>
                )}
                {offer.status === 'completed' && (
                  <Button size="sm" variant="outline" className="flex-1">
                    {t.leaveReview}
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
