'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle, Settings, LogOut } from 'lucide-react';
import { useLanguage, translations } from '@/contexts/language-context';

interface ProfilePageProps {
  userRole: 'buyer' | 'provider';
  language: 'tr' | 'en';
}

export default function ProfilePage({ userRole, language }: ProfilePageProps) {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold mb-1">{t.profileManagement}</h1>
            <p className="text-sm text-muted-foreground">{t.manageYourAccount}</p>
          </div>
          <Button size="sm" variant="outline">
            <Settings size={16} />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <Card className="p-6 border-border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h2 className="text-xl font-bold">Alex Johnson</h2>
              <p className="text-sm text-muted-foreground capitalize">
                {userRole === 'buyer' ? t.serviceBuyer : t.serviceProvider}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={14} className="text-primary fill-primary" />
                <span className="text-sm font-medium">4.9</span>
                <span className="text-xs text-muted-foreground">(234 reviews)</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full gap-2">
            <MessageCircle size={16} />
            {t.sendMessage}
          </Button>
        </Card>

        {/* Stats */}
        {userRole === 'provider' && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 border-border text-center">
              <p className="text-2xl font-bold text-primary">28</p>
              <p className="text-xs text-muted-foreground">{t.completedJobs}</p>
            </Card>
            <Card className="p-4 border-border text-center">
              <p className="text-2xl font-bold text-primary">4.9</p>
              <p className="text-xs text-muted-foreground">{t.rating}</p>
            </Card>
            <Card className="p-4 border-border text-center">
              <p className="text-2xl font-bold text-primary">3.2K</p>
              <p className="text-xs text-muted-foreground">{t.earnedPi}</p>
            </Card>
          </div>
        )}

        {userRole === 'buyer' && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 border-border text-center">
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">{t.postedRequests}</p>
            </Card>
            <Card className="p-4 border-border text-center">
              <p className="text-2xl font-bold text-primary">8</p>
              <p className="text-xs text-muted-foreground">{t.completed}</p>
            </Card>
            <Card className="p-4 border-border text-center">
              <p className="text-2xl font-bold text-primary">4.8</p>
              <p className="text-xs text-muted-foreground">{t.avgRating}</p>
            </Card>
          </div>
        )}

        {/* About & Expertise */}
        <div>
          <h3 className="font-bold mb-2">{t.about}</h3>
          <Card className="p-4 border-border">
            <p className="text-sm text-muted-foreground">
              {userRole === 'provider'
                ? 'Experienced professional with 5+ years in Web3 development. Specialized in smart contracts, DeFi protocols, and blockchain architecture.'
                : 'Looking for quality services for web3 projects. Quick payment and transparent feedback.'}
            </p>
          </Card>
        </div>

        {userRole === 'provider' && (
          <div>
            <h3 className="font-bold mb-2">{t.skills}</h3>
            <div className="flex flex-wrap gap-2">
              {['Smart Contracts', 'React', 'Web3', 'Solidity', 'DeFi'].map(
                (skill) => (
                  <Badge key={skill} variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    {skill}
                  </Badge>
                )
              )}
            </div>
          </div>
        )}

        {/* Recent Reviews */}
        <div>
          <h3 className="font-bold mb-2">{t.recentReviews}</h3>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Card key={i} className="p-4 border-border">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">Great work!</h4>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        className={
                          j < 5 ? 'text-primary fill-primary' : 'text-muted'
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  by Client {i}
                </p>
                <p className="text-sm text-muted-foreground">
                  Perfect execution and professional communication throughout
                  the project.
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Logout */}
        <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive">
          <LogOut size={16} />
          {t.logout}
        </Button>
      </div>
    </div>
  );
}
