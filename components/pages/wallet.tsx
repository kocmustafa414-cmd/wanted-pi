'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { useLanguage, translations } from '@/contexts/language-context';

interface WalletPageProps {
  language: 'tr' | 'en';
}

export default function WalletPage({ language }: WalletPageProps) {
  const t = translations[language];

  const transactions = [
    {
      id: 1,
      type: 'received',
      description: 'Payment from Design Request #145',
      amount: '+150 Pi',
      date: '2 hours ago',
      icon: TrendingUp,
    },
    {
      id: 2,
      type: 'sent',
      description: 'Payment to Smart Contract Audit',
      amount: '-800 Pi',
      date: '1 day ago',
      icon: TrendingDown,
    },
    {
      id: 3,
      type: 'received',
      description: 'Bonus from platform',
      amount: '+50 Pi',
      date: '3 days ago',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <h1 className="text-xl font-bold mb-1">{t.walletManagement}</h1>
        <p className="text-sm text-muted-foreground">{t.manageYourPiBalance}</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <Card className="p-6 border-primary bg-gradient-to-br from-primary/20 to-primary/10 border-2">
          <p className="text-sm text-muted-foreground mb-2">{t.availableBalance}</p>
          <div className="text-5xl font-bold text-primary mb-6">2,450 Pi</div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t.totalEarned}</p>
              <p className="font-bold text-lg">5,320 Pi</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t.totalSpent}</p>
              <p className="font-bold text-lg">2,870 Pi</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 bg-primary text-primary-foreground gap-2">
              <Send size={16} />
              {t.send}
            </Button>
            <Button variant="outline" className="flex-1 gap-2 border-primary/30">
              <Plus size={16} />
              {t.receive}
            </Button>
          </div>
        </Card>

        {/* Wallet Address */}
        <Card className="p-4 border-border">
          <p className="text-xs text-muted-foreground mb-2">{t.walletAddress}</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-secondary/50 p-2 rounded text-foreground break-all">
              0x7B5A...Cf9d
            </code>
            <Button size="sm" variant="outline">
              {t.copy}
            </Button>
          </div>
        </Card>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-lg font-bold mb-3">{t.recentTransactions}</h2>
          <div className="space-y-2">
            {transactions.map((tx) => {
              const IconComponent = tx.icon;
              return (
                <Card key={tx.id} className="p-4 border-border">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        tx.type === 'received'
                          ? 'bg-green-500/20'
                          : 'bg-red-500/20'
                      }`}
                    >
                      <IconComponent
                        size={20}
                        className={
                          tx.type === 'received'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                    <p
                      className={`font-bold text-sm ${
                        tx.type === 'received'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {tx.amount}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Help */}
        <Button variant="outline" className="w-full">
          {t.viewTransactionHistory}
        </Button>
      </div>
    </div>
  );
}
