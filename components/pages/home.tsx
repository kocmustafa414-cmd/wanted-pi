'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Users } from 'lucide-react';
import { useLanguage, translations } from '@/contexts/language-context';

interface HomePageProps {
  userRole: 'buyer' | 'provider';
  language: 'tr' | 'en';
}

const categories = [
  { name: 'Design', icon: '🎨', count: '142' },
  { name: 'Development', icon: '💻', count: '256' },
  { name: 'Writing', icon: '✍️', count: '89' },
  { name: 'Marketing', icon: '📊', count: '134' },
  { name: 'Audio', icon: '🎙️', count: '67' },
  { name: 'Video', icon: '🎬', count: '98' },
];

const featuredServices = [
  {
    id: 1,
    title: 'Web Design Services',
    provider: 'Alex Studio',
    rating: 4.9,
    reviews: 234,
    price: '50-150 Pi',
    image: '🎨',
  },
  {
    id: 2,
    title: 'Smart Contract Development',
    provider: 'Web3 Dev Pro',
    rating: 4.8,
    reviews: 189,
    price: '200-500 Pi',
    image: '💻',
  },
  {
    id: 3,
    title: 'Content Writing',
    provider: 'Creative Words',
    rating: 4.7,
    reviews: 156,
    price: '20-100 Pi',
    image: '✍️',
  },
];

export default function HomePage({ userRole, language }: HomePageProps) {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Wanted.pi</h1>
            <p className="text-sm text-muted-foreground">
              {userRole === 'buyer' ? t.findServices : t.offerServices}
            </p>
          </div>
          <div className="text-3xl font-bold text-primary">W</div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{t.activeServices}</p>
                <p className="text-2xl font-bold">1.2K</p>
              </div>
              <TrendingUp className="text-primary" size={24} />
            </div>
          </Card>
          <Card className="p-4 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{t.providers}</p>
                <p className="text-2xl font-bold">850+</p>
              </div>
              <Users className="text-primary" size={24} />
            </div>
          </Card>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-lg font-bold mb-3">{t.serviceCategories}</h2>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((category) => (
              <Card key={category.name} className="p-3 border-border cursor-pointer hover:border-primary transition-colors text-center">
                <div className="text-2xl mb-1">{category.icon}</div>
                <p className="text-xs font-medium">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.count}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Services/Requests */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">
              {userRole === 'buyer' ? t.topRatedServices : t.recentRequests}
            </h2>
            <Button variant="ghost" size="sm" className="text-primary">
              {t.viewAll}
            </Button>
          </div>
          <div className="space-y-3">
            {featuredServices.map((service) => (
              <Card key={service.id} className="p-4 border-border cursor-pointer hover:bg-card/80 transition-colors">
                <div className="flex gap-3">
                  <div className="text-3xl">{service.image}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1">{service.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{service.provider}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-primary fill-primary" />
                        <span className="text-xs font-medium">{service.rating}</span>
                        <span className="text-xs text-muted-foreground">({service.reviews})</span>
                      </div>
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                        {service.price}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Button className="w-full bg-primary text-primary-foreground py-6 font-bold text-base rounded-lg">
          {userRole === 'buyer' ? t.createServiceRequest : t.browseRequests}
        </Button>
      </div>
    </div>
  );
}
