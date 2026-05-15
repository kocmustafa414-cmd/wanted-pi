'use client';

import React, { createContext, useContext, useState, type ReactNode } from 'react';

type LanguageType = 'tr' | 'en';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageType>('tr');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translation object
export const translations = {
  tr: {
    // Navigation
    home: 'Ana Sayfa',
    requests: 'Talepler',
    offers: 'Teklifler',
    wallet: 'Cüzdan',
    profile: 'Profil',
    settings: 'Ayarlar',

    // Role Selection
    serviceBuyer: 'Hizmet Alan',
    serviceProvider: 'Hizmet Veren',
    findTrustedProfessionals: 'Güvenilir profesyonelleri bulun',
    submitOffersForJobs: 'İşler için teklif gönderin',
    canSwitchRoles: 'Profil ayarlarından herhangi bir zamanda rol değiştirebilirsiniz',

    // Home Page
    findServices: 'Hizmet Bul',
    offerServices: 'Hizmet Sun',
    activeServices: 'Aktif Hizmetler',
    providers: 'Sağlayıcılar',
    serviceCategories: 'Hizmet Kategorileri',
    topRatedServices: 'En Yüksek Puanlı Hizmetler',
    recentRequests: 'Son Talepler',
    viewAll: 'Tümünü Gör',
    createServiceRequest: 'Hizmet Talebi Oluştur',
    browseRequests: 'Talepleri Gözat',

    // Requests Page
    serviceRequests: 'Hizmet Talepleri',
    manageYourServiceRequests: 'Hizmet taleplerini yönetin',
    browseAndOfferServices: 'Hizmetleri gözat ve teklif verin',
    newRequest: 'Yeni Talep',
    all: 'Tümü',
    open: 'Açık',
    inProgress: 'Devam Ediyor',
    completed: 'Tamamlandı',
    budget: 'Bütçe',
    offers: 'Teklifler',
    offer: 'Teklif Ver',

    // Offers Page
    serviceOffers: 'Hizmet Teklifleri',
    offersReceivedForRequests: 'Talepleriniize alınan teklifler',
    offersYouSubmitted: 'Gönderdiğiniz teklifler',
    price: 'Fiyat',
    delivery: 'Teslimat',
    status: 'Durum',
    pending: 'Beklemede',
    accepted: 'Kabul Edildi',
    acceptOffer: 'Teklifi Kabul Et',
    decline: 'Reddet',
    viewProgress: 'İlerlemeyi Gör',
    leaveReview: 'Yorum Bırak',

    // Wallet Page
    walletManagement: 'Cüzdan Yönetimi',
    manageYourPiBalance: 'Pi bakiyenizi yönetin',
    availableBalance: 'Kullanılabilir Bakiye',
    totalEarned: 'Toplam Kazanç',
    totalSpent: 'Toplam Harcama',
    send: 'Gönder',
    receive: 'Al',
    walletAddress: 'Cüzdan Adresi',
    copy: 'Kopyala',
    recentTransactions: 'Son İşlemler',
    viewTransactionHistory: 'İşlem Geçmişini Gör',

    // Profile Page
    profileManagement: 'Profil Yönetimi',
    manageYourAccount: 'Hesabınızı yönetin',
    sendMessage: 'Mesaj Gönder',
    completedJobs: 'Tamamlanan İşler',
    rating: 'Puan',
    earnedPi: 'Kazanılan Pi',
    postedRequests: 'Yayınlanan Talepler',
    avgRating: 'Ort. Puan',
    about: 'Hakkında',
    skills: 'Beceriler',
    recentReviews: 'Son Yorumlar',
    logout: 'Çıkış',

    // Settings
    language: 'Dil',
    accountType: 'Hesap Tipi',
    buyer: 'Hizmet Alan',
    provider: 'Hizmet Veren',
    verification: 'Doğrulama',
    verified: 'Belge doğrulama bekliyor',
    documents: 'Gerekli Belgeler',
    commission: 'Komisyon',
    commissionText: 'Pi ile ödeme: komisyon yok. Banka ile ödeme: %2 komisyon.',
    offerFee: 'Teklif Ücreti',
    offerFeeText: 'Pi 314 USD baz alınırsa teklif ücreti 0.314 USD olur.',
    support: 'Destek',
    aboutWanted: 'Wanted.pi Hakkında',
  },
  en: {
    // Navigation
    home: 'Home',
    requests: 'Requests',
    offers: 'Offers',
    wallet: 'Wallet',
    profile: 'Profile',
    settings: 'Settings',

    // Role Selection
    serviceBuyer: 'Service Buyer',
    serviceProvider: 'Service Provider',
    findTrustedProfessionals: 'Find trusted professionals',
    submitOffersForJobs: 'Submit offers for jobs',
    canSwitchRoles: 'You can switch roles anytime from your profile settings',

    // Home Page
    findServices: 'Find Services',
    offerServices: 'Offer Services',
    activeServices: 'Active Services',
    providers: 'Providers',
    serviceCategories: 'Service Categories',
    topRatedServices: 'Top Rated Services',
    recentRequests: 'Recent Requests',
    viewAll: 'View All',
    createServiceRequest: 'Create Service Request',
    browseRequests: 'Browse Requests',

    // Requests Page
    serviceRequests: 'Service Requests',
    manageYourServiceRequests: 'Manage your service requests',
    browseAndOfferServices: 'Browse and offer services',
    newRequest: 'New Request',
    all: 'All',
    open: 'Open',
    inProgress: 'In Progress',
    completed: 'Completed',
    budget: 'Budget',
    offers: 'Offers',
    offer: 'Offer',

    // Offers Page
    serviceOffers: 'Service Offers',
    offersReceivedForRequests: 'Offers received for your requests',
    offersYouSubmitted: 'Offers you have submitted',
    price: 'Price',
    delivery: 'Delivery',
    status: 'Status',
    pending: 'Pending',
    accepted: 'Accepted',
    acceptOffer: 'Accept Offer',
    decline: 'Decline',
    viewProgress: 'View Progress',
    leaveReview: 'Leave Review',

    // Wallet Page
    walletManagement: 'Wallet',
    manageYourPiBalance: 'Manage your Pi balance',
    availableBalance: 'Available Balance',
    totalEarned: 'Total Earned',
    totalSpent: 'Total Spent',
    send: 'Send',
    receive: 'Receive',
    walletAddress: 'Wallet Address',
    copy: 'Copy',
    recentTransactions: 'Recent Transactions',
    viewTransactionHistory: 'View Transaction History',

    // Profile Page
    profileManagement: 'Profile',
    manageYourAccount: 'Manage your account',
    sendMessage: 'Send Message',
    completedJobs: 'Completed Jobs',
    rating: 'Rating',
    earnedPi: 'Earned Pi',
    postedRequests: 'Posted Requests',
    avgRating: 'Avg Rating',
    about: 'About',
    skills: 'Skills',
    recentReviews: 'Recent Reviews',
    logout: 'Logout',

    // Settings
    language: 'Language',
    accountType: 'Account Type',
    buyer: 'Service Buyer',
    provider: 'Service Provider',
    verification: 'Verification',
    verified: 'Document verification pending',
    documents: 'Required Documents',
    commission: 'Commission',
    commissionText: 'Pi payment: no commission. Bank payment: 2% commission.',
    offerFee: 'Offer Fee',
    offerFeeText: 'If Pi reference price is 314 USD, offer fee is 0.314 USD.',
    support: 'Support',
    aboutWanted: 'About Wanted.pi',
  },
};
