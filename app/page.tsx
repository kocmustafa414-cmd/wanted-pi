'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search, Briefcase, Bell, User, ChevronRight, FileText, Star, Home,
  Building2, Crown, X, ShieldCheck, CheckCircle, Ban, Wallet, Upload, BadgeCheck
} from 'lucide-react';

declare global {
  interface Window {
    Pi?: any;
  }
}

type Role = 'buyer' | 'provider' | 'admin' | null;
type Page = 'neoHome' | 'jobs' | 'offers' | 'notifications' | 'profile' | 'settings' | 'providerSettings' | 'serviceAdd' | 'providerHome' | 'adminHome';
type Lang = 'tr' | 'en';

type Service = {
  id: string;
  title: string;
  sector: string;
  icon: string;
  image?: string;
  trend?: boolean;
};

type RequestItem = {
  id: number;
  serviceId: string;
  title: string;
  sector: string;
  job: string;
  name: string;
  phone: string;
  location: string;
  budget: string;
  date: string;
  description: string;
  status: 'open' | 'offer_waiting' | 'provider_selected' | 'in_progress' | 'completed' | 'cancelled';
  demo?: boolean;
  owner?: 'demo' | 'me';
};

type OfferItem = {
  id: number;
  requestId: number;
  requestTitle: string;
  sector: string;
  job: string;
  providerName: string;
  phone: string;
  company: string;
  experience: string;
  certificate: string;
  price: string;
  message: string;
  status: 'pending' | 'selected' | 'ignored' | 'completed';
  feePaid: string;
};

type JobItem = {
  id: number;
  requestId: number;
  offerId: number;
  buyerKey: string;
  providerKey: string;
  title: string;
  providerName: string;
  company: string;
  price: string;
  status: 'started' | 'completed';
  startedAt: string;
  completedAt?: string;
};

type MessageItem = {
  id: number;
  jobId: number;
  senderKey: string;
  receiverKey: string;
  message: string;
  createdAt: string;
};

type DocumentItem = {
  id: number;
  userKey: string;
  role: string;
  fullName: string;
  phone: string;
  company: string;
  profession: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  createdAt: string;
};

type ReviewItem = {
  id: number;
  jobId: number;
  providerKey: string;
  buyerKey: string;
  stars: number;
  comment: string;
  jobTitle: string;
  providerName: string;
  createdAt: string;
};

type EscrowStatus = 'pending_funding' | 'funded' | 'provider_assigned' | 'work_started' | 'work_completed' | 'customer_approved' | 'released' | 'disputed' | 'refunded';

type EscrowItem = {
  id: number;
  jobId: number;
  requestId: number;
  offerId: number;
  buyerKey: string;
  providerKey: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  status: EscrowStatus;
  createdAt: string;
  fundedAt?: string;
  releasedAt?: string;
  disputedAt?: string;
};

type Profile = {
  fullName: string;
  phone: string;
  location: string;
  tcNo: string;
  piWallet: string;
  iban: string;
  company: string;
  profession: string;
  certificates: string;
  experience: string;
  about: string;
  services: string[];
};


const SUPABASE_URL = 'https://rmaczonfwjmxiggpnueb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TadYbajo6iPKMfpsNkWN0g_m35JaScB';
const STORAGE_KEY = 'wanted-varan21-documents-market';
const PERMANENT_STORAGE_KEY = 'wanted-permanent-user-state';
const STORAGE_FALLBACK_KEYS = [
  'wanted-permanent-user-state',
  'wanted-varan21-documents-market',
  'wanted-varan22-reviews-market',
  'wanted-varan20-live-market',
  'wanted-varan19-supabase-cloud',
  'wanted-varan16-demo-market',
];
const ADMIN_PASS = 'sanane61';
// Pi authentication gate removed: app opens directly; payments/auth can be added later.
const PI_DOMAIN_VALIDATION_KEY = '5d6aae9c8501a69ffca438a3612d8ee8b1fb3947ebfe2f5f301a376a13f1331c8434bb7755fe10a8564f0e71dcbc93972afd0fa6717d8050e0e8f8143436a87c';
const OFFER_FEE_PI = 0.314;
const DEMO_PI_TL = 35;
const OFFER_FEE_TL = Number((OFFER_FEE_PI * DEMO_PI_TL).toFixed(2));


const WANTED_APP_URL = 'https://wanted-pi-chi.vercel.app';
const WANTED_SHARE_TEXT = `🚀 Wanted.pi aktif!

Pi Browser ile aç:
${WANTED_APP_URL}

Destek için:
✅ Pi Browser’dan aç
✅ Giriş yap
✅ Uygulamada gezin
✅ Pi test ödeme ekranına kadar ilerle

wanted.pi domain claim desteği için teşekkürler 💜`;

async function shareWantedApp() {
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({
        title: 'Wanted.pi',
        text: WANTED_SHARE_TEXT,
        url: WANTED_APP_URL,
      });
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(WANTED_SHARE_TEXT);
      alert('Wanted.pi davet mesajı kopyalandı. Telegram veya WhatsApp grubuna yapıştırabilirsin.');
      return;
    }

    if (typeof window !== 'undefined') {
      window.prompt('Bu mesajı kopyalayıp paylaş:', WANTED_SHARE_TEXT);
    }
  } catch (error) {
    console.log('Share failed:', error);
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(WANTED_SHARE_TEXT);
      alert('Paylaşım açılmadı ama davet mesajı kopyalandı. Telegram veya WhatsApp grubuna yapıştırabilirsin.');
    } else if (typeof window !== 'undefined') {
      window.prompt('Bu mesajı kopyalayıp paylaş:', WANTED_SHARE_TEXT);
    }
  }
}

const t = {
  app: 'Wanted.pi',
  slogan: 'Arayan bulur, çalışan kazanır.',
  buyer: 'Hizmet Al',
  provider: 'Hizmet Ver',
  admin: 'Admin',
  roleSelect: 'Nasıl devam etmek istiyorsun?',
  buyerDesc: 'Hizmet, usta, uzman veya çalışan ara',
  providerDesc: 'Hizmet ver, teklif gönder, iş al',
  adminDesc: 'Kurucu paneli / şifreli giriş',
  search: 'Hangi hizmete ihtiyacın var?',
  trends: 'Trend Olan Hizmetler',
  jobs: 'İşlerim',
  openJobs: 'Açık Talep Pazarı',
  offers: 'Teklifler',
  notifications: 'Bildirimler',
  profile: 'Profil',
  myServices: 'Hizmetlerim',
  createRequest: 'Talep Oluştur',
  createOffer: `Teklif Ver • ${OFFER_FEE_PI} Pi (~₺${OFFER_FEE_TL})`,
  incomingOffers: 'Gelen Teklifler',
  myOffers: 'Gönderdiğim Teklifler',
  selectOffer: 'Teklifi Seç',
  ignoreOffer: 'Yoksay',
  selectedOffer: 'Seçilen Teklif',
  requestDetail: 'Talep Detayı',
  completeProfile: 'Talep oluşturmadan önce profilini tamamla',
  completeProvider: 'Hizmet vermeden önce kayıt ol',
  name: 'Ad Soyad',
  phone: 'Telefon',
  location: 'Konum',
  budget: 'Bütçe',
  date: 'Tarih',
  description: 'Açıklama',
  company: 'Firma / Şahıs',
  experience: 'Deneyim',
  certificate: 'Sertifika / Belge',
  price: 'Teklif Fiyatı',
  message: 'Mesaj / Açıklama',
  save: 'Kaydet',
  cancel: 'Vazgeç',
  password: 'Admin şifresi',
  wrongPass: 'Şifre hatalı',
  dbSaved: 'Talep oluşturuldu ve veritabanına kaydedildi',
  offerSaved: 'Teklif gönderildi',
  selected: 'Teklif seçildi ve iş başlatıldı',
  activeJobs: 'Aktif İşler',
  completeJob: 'İşi Tamamla',
  jobStarted: 'İş başlatıldı',
  jobCompleted: 'İş tamamlandı',
  reviewJob: 'Yorum Yap',
  reviewSaved: 'Yorum ve puan kaydedildi',
  providerRating: 'Hizmet Veren Puanı',
  messages: 'Mesajlar',
  sendMessage: 'Mesaj Gönder',
  ignored: 'Teklif yoksayıldı',
  wallet: 'Cüzdan',
  balance: 'Demo Bakiye',
  adminPanel: 'Kurucu Paneli',
  buyerSettings: 'Ayarlar',
  myProfile: 'Profilim',
  passwords: 'Şifreler',
  paymentOptions: 'Ödeme seçenekleri',
  inviteFriend: 'Arkadaşına tavsiye et',
  rateApp: 'Uygulamayı değerlendir',
  supportCenter: 'Destek merkezi',
  dataPrivacy: 'Veri ve gizlilik',
  complaintSuggestion: 'Şikayet ve öneri',
  logout: 'Çıkış Yap',
  version: 'Wanted.pi Varan 24.3 — Working Language Switch',
};


const translations: Record<Lang, typeof t> = {
  tr: t,
  en: {
    ...t,
    slogan: 'Those who search find, those who work earn.',
    buyer: 'Find Service',
    provider: 'Offer Service',
    roleSelect: 'How would you like to continue?',
    buyerDesc: 'Find a service, expert or worker',
    providerDesc: 'Offer services, send quotes, get jobs',
    search: 'What service do you need?',
    trends: 'Trending Services',
    jobs: 'My Jobs',
    openJobs: 'Open Request Market',
    offers: 'Offers',
    notifications: 'Notifications',
    profile: 'Profile',
    myServices: 'My Services',
    createRequest: 'Create Request',
    createOffer: `Send Offer • ${OFFER_FEE_PI} Pi (~₺${OFFER_FEE_TL})`,
    incomingOffers: 'Incoming Offers',
    myOffers: 'My Sent Offers',
    selectOffer: 'Select Offer',
    ignoreOffer: 'Ignore',
    selectedOffer: 'Selected Offer',
    requestDetail: 'Request Detail',
    completeProfile: 'Complete your profile before creating a request',
    completeProvider: 'Register before offering services',
    name: 'Full Name',
    phone: 'Phone',
    location: 'Location',
    budget: 'Budget',
    date: 'Date',
    description: 'Description',
    company: 'Company / Individual',
    experience: 'Experience',
    certificate: 'Certificate / Document',
    price: 'Offer Price',
    message: 'Message / Description',
    save: 'Save',
    cancel: 'Cancel',
    dbSaved: 'Request created and saved to database',
    offerSaved: 'Offer sent',
    selected: 'Offer selected and job started',
    activeJobs: 'Active Jobs',
    completeJob: 'Complete Job',
    jobStarted: 'Job started',
    jobCompleted: 'Job completed',
    reviewJob: 'Add Review',
    reviewSaved: 'Review and rating saved',
    providerRating: 'Provider Rating',
    messages: 'Messages',
    sendMessage: 'Send Message',
    ignored: 'Offer ignored',
    wallet: 'Wallet',
    balance: 'Demo Balance',
    buyerSettings: 'Settings',
    myProfile: 'My Profile',
    passwords: 'Passwords',
    paymentOptions: 'Payment Options',
    inviteFriend: 'Invite a friend',
    rateApp: 'Rate the app',
    supportCenter: 'Support Center',
    dataPrivacy: 'Data and privacy',
    complaintSuggestion: 'Complaint and suggestion',
    logout: 'Logout',
    version: 'Wanted.pi Varan 24.3 — Working Language Switch',
  },
};

const IMG = {
  cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
  moving: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=900&q=80',
  painting: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
  repair: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80',
  health: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
  education: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
  legal: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
  digital: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
  beauty: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
  event: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80',
  construction: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80',
  auto: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=80',
  textile: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
  finance: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
  pet: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
  logistics: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
};

const serviceSections: { title: string; services: Service[] }[] = [
  {
    title: 'Trend Hizmetler',
    services: [
      { id: 'ev-temizligi', title: 'Ev Temizliği', sector: 'Temizlik', icon: 'clean', image: IMG.cleaning, trend: true },
      { id: 'evden-eve-nakliyat', title: 'Evden Eve Nakliyat', sector: 'Nakliyat', icon: 'moving', image: IMG.moving, trend: true },
      { id: 'boya-badana', title: 'Boya Badana', sector: 'Tadilat', icon: 'paint', image: IMG.painting, trend: true },
      { id: 'klima-servisi', title: 'Klima Servisi', sector: 'Teknik Servis', icon: 'repair', image: IMG.repair, trend: true },
      { id: 'hasta-bakici', title: 'Hasta Bakıcı', sector: 'Sağlık', icon: 'health', image: IMG.health, trend: true },
      { id: 'tez-danismanligi', title: 'Tez Danışmanlığı', sector: 'Eğitim', icon: 'education', image: IMG.education, trend: true },
    ],
  },
  {
    title: 'Ev Hizmetleri',
    services: [
      { id: 'temizlikci', title: 'Temizlikçi', sector: 'Temizlik', icon: 'clean', image: IMG.cleaning },
      { id: 'koltuk-yikama', title: 'Koltuk Yıkama', sector: 'Temizlik', icon: 'clean', image: IMG.cleaning },
      { id: 'halı-yikama', title: 'Halı Yıkama', sector: 'Temizlik', icon: 'clean', image: IMG.cleaning },
      { id: 'cam-temizligi', title: 'Cam Temizliği', sector: 'Temizlik', icon: 'clean', image: IMG.cleaning },
      { id: 'bahcivan', title: 'Bahçıvan', sector: 'Bahçe', icon: 'garden', image: IMG.cleaning },
      { id: 'ev-yardimcisi', title: 'Ev Yardımcısı', sector: 'Ev Hizmeti', icon: 'home', image: IMG.cleaning },
      { id: 'cocuk-bakicisi', title: 'Çocuk Bakıcısı', sector: 'Bakım', icon: 'care', image: IMG.health },
      { id: 'yasli-bakimi', title: 'Yaşlı Bakımı', sector: 'Bakım', icon: 'care', image: IMG.health },
    ],
  },
  {
    title: 'Nakliyat ve Depolama',
    services: [
      { id: 'nakliye', title: 'Nakliye', sector: 'Nakliyat', icon: 'moving', image: IMG.moving },
      { id: 'parca-esya-tasima', title: 'Parça Eşya Taşıma', sector: 'Nakliyat', icon: 'moving', image: IMG.moving },
      { id: 'ofis-tasima', title: 'Ofis Taşıma', sector: 'Nakliyat', icon: 'moving', image: IMG.moving },
      { id: 'moto-kurye', title: 'Moto Kurye', sector: 'Kurye', icon: 'moving', image: IMG.logistics },
      { id: 'depolama', title: 'Eşya Depolama', sector: 'Depolama', icon: 'storage', image: IMG.logistics },
      { id: 'lojistik-danismani', title: 'Lojistik Danışmanı', sector: 'Nakliyat', icon: 'logistics', image: IMG.logistics },
    ],
  },
  {
    title: 'Tadilat, Dekorasyon ve İnşaat',
    services: [
      { id: 'duvar-dekorasyon', title: 'Duvar Dekorasyon', sector: 'Dekorasyon', icon: 'paint', image: IMG.painting },
      { id: 'insaat-ustasi', title: 'İnşaat Ustası', sector: 'İnşaat', icon: 'construction', image: IMG.construction },
      { id: 'fayans-seramik', title: 'Fayans Seramik', sector: 'Tadilat', icon: 'construction', image: IMG.construction },
      { id: 'alci-ustasi', title: 'Alçı Ustası', sector: 'Tadilat', icon: 'construction', image: IMG.construction },
      { id: 'sivaci', title: 'Sıvacı', sector: 'Tadilat', icon: 'construction', image: IMG.construction },
      { id: 'marangoz', title: 'Marangoz', sector: 'Tadilat', icon: 'repair', image: IMG.repair },
      { id: 'mobilya-montaj', title: 'Mobilya Montaj', sector: 'Montaj', icon: 'repair', image: IMG.repair },
      { id: 'cati-ustasi', title: 'Çatı Ustası', sector: 'İnşaat', icon: 'construction', image: IMG.construction },
    ],
  },
  {
    title: 'Teknik Servis ve Ustalar',
    services: [
      { id: 'elektrikci', title: 'Elektrikçi', sector: 'Teknik Servis', icon: 'repair', image: IMG.repair },
      { id: 'su-tesisatcisi', title: 'Su Tesisatçısı', sector: 'Teknik Servis', icon: 'repair', image: IMG.repair },
      { id: 'kombi-servisi', title: 'Kombi Servisi', sector: 'Teknik Servis', icon: 'repair', image: IMG.repair },
      { id: 'beyaz-esya-servisi', title: 'Beyaz Eşya Servisi', sector: 'Teknik Servis', icon: 'repair', image: IMG.repair },
      { id: 'celingir', title: 'Çilingir', sector: 'Teknik Servis', icon: 'repair', image: IMG.repair },
      { id: 'asansor-servisi', title: 'Asansör Servisi', sector: 'Teknik Servis', icon: 'repair', image: IMG.repair },
      { id: 'oto-tamircisi', title: 'Oto Tamircisi', sector: 'Otomotiv', icon: 'auto', image: IMG.auto },
      { id: 'lastikci', title: 'Lastikçi', sector: 'Otomotiv', icon: 'auto', image: IMG.auto },
    ],
  },
  {
    title: 'Sağlık ve Bakım',
    services: [
      { id: 'evde-hemsire', title: 'Evde Hemşire', sector: 'Sağlık', icon: 'health', image: IMG.health },
      { id: 'doktor', title: 'Doktor', sector: 'Sağlık', icon: 'health', image: IMG.health },
      { id: 'psikolog', title: 'Psikolog', sector: 'Sağlık', icon: 'health', image: IMG.health },
      { id: 'diyetisyen', title: 'Diyetisyen', sector: 'Sağlık', icon: 'health', image: IMG.health },
      { id: 'fizyoterapist', title: 'Fizyoterapist', sector: 'Sağlık', icon: 'health', image: IMG.health },
      { id: 'dis-hekimi', title: 'Diş Hekimi', sector: 'Sağlık', icon: 'health', image: IMG.health },
      { id: 'veteriner', title: 'Veteriner', sector: 'Sağlık', icon: 'pet', image: IMG.pet },
    ],
  },
  {
    title: 'Eğitim ve Akademik',
    services: [
      { id: 'ozel-ders', title: 'Özel Ders', sector: 'Eğitim', icon: 'education', image: IMG.education },
      { id: 'matematik-ozel-ders', title: 'Matematik Özel Ders', sector: 'Eğitim', icon: 'education', image: IMG.education },
      { id: 'ingilizce-ozel-ders', title: 'İngilizce Özel Ders', sector: 'Eğitim', icon: 'education', image: IMG.education },
      { id: 'tez-yazimi', title: 'Tez Yazımı', sector: 'Eğitim', icon: 'education', image: IMG.education },
      { id: 'akademik-danisman', title: 'Akademik Danışman', sector: 'Eğitim', icon: 'education', image: IMG.education },
      { id: 'yazilim-egitimi', title: 'Yazılım Eğitimi', sector: 'Eğitim', icon: 'digital', image: IMG.digital },
    ],
  },
  {
    title: 'Profesyonel ve Dijital',
    services: [
      { id: 'avukat', title: 'Avukat', sector: 'Hukuk', icon: 'legal', image: IMG.legal },
      { id: 'muhasebeci', title: 'Muhasebeci', sector: 'Finans', icon: 'finance', image: IMG.finance },
      { id: 'yazilimci', title: 'Yazılımcı', sector: 'Dijital', icon: 'digital', image: IMG.digital },
      { id: 'web-site-yapimi', title: 'Web Site Yapımı', sector: 'Dijital', icon: 'digital', image: IMG.digital },
      { id: 'grafik-tasarim', title: 'Grafik Tasarım', sector: 'Dijital', icon: 'digital', image: IMG.digital },
      { id: 'sosyal-medya', title: 'Sosyal Medya Yönetimi', sector: 'Dijital', icon: 'digital', image: IMG.digital },
      { id: 'cevirmen', title: 'Çevirmen', sector: 'Profesyonel', icon: 'education', image: IMG.education },
    ],
  },
  {
    title: 'Güzellik, Giyim ve Etkinlik',
    services: [
      { id: 'terzi', title: 'Terzi', sector: 'Giyim', icon: 'textile', image: IMG.textile },
      { id: 'kuafor', title: 'Kuaför', sector: 'Güzellik', icon: 'beauty', image: IMG.beauty },
      { id: 'berber', title: 'Berber', sector: 'Güzellik', icon: 'beauty', image: IMG.beauty },
      { id: 'makyaj-uzmani', title: 'Makyaj Uzmanı', sector: 'Güzellik', icon: 'beauty', image: IMG.beauty },
      { id: 'fotografci', title: 'Fotoğrafçı', sector: 'Medya', icon: 'event', image: IMG.event },
      { id: 'video-cekim', title: 'Video Çekimi', sector: 'Medya', icon: 'event', image: IMG.event },
      { id: 'dugun-planlama', title: 'Düğün Planlama', sector: 'Etkinlik', icon: 'event', image: IMG.event },
    ],
  },
];

const extraSearchServices: Service[] = [
  'Madenci','Kaynakçı','Makine Ustası','Demirci','Camcı','Panjur Tamiri','Kapı Tamiri','Isı Yalıtım','Güneş Paneli Kurulumu','Kalorifer Tesisatçısı','Doğalgaz Tesisatçısı','Mermer Ustası','Granit Ustası','Beton Kesme','Vinç Operatörü','Kepçe Operatörü','Forklift Operatörü','Kamyon Şoförü','Depo Elemanı','Paketleme Elemanı','Garson','Aşçı','Pastacı','Barista','Kasiyer','Market Elemanı','Tezgahtar','Satış Temsilcisi','Çağrı Merkezi Elemanı','Sekreter','Ofis Asistanı','İnsan Kaynakları Uzmanı','Finans Danışmanı','Sigortacı','Bankacı','Noter İşleri Danışmanı','Tercüman','Yeminli Tercüman','Editör','Redaktör','İçerik Yazarı','SEO Uzmanı','Reklam Uzmanı','E-Ticaret Uzmanı','Ürün Fotoğrafçısı','Drone Çekimi','Organizasyon','Düğün Fotoğrafçısı','Müzisyen','DJ','Animatör','Güvenlik Görevlisi','Özel Şoför','Vale','Emlakçı','Mimar','İç Mimar','Peyzaj Mimarı','Harita Mühendisi','İnşaat Mühendisi','Makine Mühendisi','Elektrik Mühendisi','Gıda Mühendisi','Diş Hekimi Asistanı','Laborant','Paramedik','Ambulans Şoförü','Evde Serum Hizmeti','Hasta Refakatçisi','Engelli Bakımı','Oyun Ablası','Bebek Bakıcısı','Köpek Gezdirme','Pet Kuaförü','Veteriner Teknikeri','Ayakkabı Tamiri','Kuru Temizleme','Ütü Hizmeti','Perde Yıkama','Stor Perde Temizliği','Ofis Temizliği','İnşaat Sonrası Temizlik','Haşere İlaçlama','Havuz Bakımı'
].map((title) => ({
  id: `search-${title.toLowerCase().replaceAll(' ', '-').replaceAll('ı','i').replaceAll('ğ','g').replaceAll('ü','u').replaceAll('ş','s').replaceAll('ö','o').replaceAll('ç','c')}`,
  title,
  sector: 'Diğer Hizmetler',
  icon: 'search',
  image: IMG.digital,
}));

const visibleServices = serviceSections.flatMap((s) => s.services);
const allServices = [...visibleServices, ...extraSearchServices];
const defaultProfile: Profile = {
  fullName: '',
  phone: '',
  location: '',
  tcNo: '',
  piWallet: '',
  iban: '',
  company: '',
  profession: '',
  certificates: '',
  experience: '',
  about: '',
  services: [],
};

function makeDemoRequests(): RequestItem[] {
  const places = ['İstanbul Kadıköy', 'İstanbul Maltepe', 'Ankara Çankaya', 'İzmir Karşıyaka', 'Bursa Nilüfer'];
  const desc = [
    'Acil destek arıyorum, uygun teklif bekliyorum.',
    'Bu hafta içinde hizmet almak istiyorum.',
    'Deneyimli ve güvenilir hizmet veren arıyorum.',
    'Fiyat ve müsaitlik bilgisi rica ederim.',
    'Kaliteli ve hızlı çözüm bekliyorum.',
  ];
  const budgets = ['750 TL', '1.500 TL', '3.000 TL', '5.000 TL', '12.000 TL'];
  let id = 1000;
  const selected = allServices.slice(0, 20); // 20 hizmet x 5 talep = 100 demo talep
  const out: RequestItem[] = [];

  selected.forEach((service) => {
    for (let i = 0; i < 5; i += 1) {
      out.push({
        id: id++,
        serviceId: service.id,
        title: `${service.title} talebi`,
        sector: service.sector,
        job: service.title,
        name: `Demo Müşteri ${i + 1}`,
        phone: `05${Math.floor(100000000 + Math.random() * 899999999)}`,
        location: places[i % places.length],
        budget: budgets[(i + service.title.length) % budgets.length],
        date: `2026-06-${String(10 + i).padStart(2, '0')}`,
        description: `${service.title} için ${desc[i]}`,
        status: 'open',
        demo: true,
        owner: 'demo',
      });
    }
  });

  return out;
}

async function supabaseInsert(table: string, payload: any) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.log('Supabase fallback:', error);
  }
}

function getReviewStats(reviews: ReviewItem[], providerKey = 'provider-demo') {
  const providerReviews = reviews.filter((r) => r.providerKey === providerKey);
  const count = providerReviews.length;
  const avg = count ? Number((providerReviews.reduce((sum, r) => sum + Number(r.stars || 0), 0) / count).toFixed(1)) : 0;
  return { count, avg, reviews: providerReviews };
}

function isProfileFilled(profile?: Partial<Profile> | null) {
  return Boolean(profile && (profile.fullName || profile.phone || profile.location || profile.company || profile.profession || profile.piWallet || profile.iban || (profile.services && profile.services.length)));
}

function mergeProfileSafe(current: Profile, incoming?: Partial<Profile> | null): Profile {
  if (!incoming) return current;
  if (!isProfileFilled(incoming) && isProfileFilled(current)) return current;
  return { ...current, ...incoming, services: Array.isArray(incoming.services) ? incoming.services : current.services };
}

function buildSafeSnapshot(state: any) {
  return {
    role: state.role || null,
    page: state.page || 'neoHome',
    profile: mergeProfileSafe(defaultProfile, state.profile || {}),
    requests: Array.isArray(state.requests) && state.requests.length ? state.requests : makeDemoRequests(),
    offers: Array.isArray(state.offers) ? state.offers : [],
    jobs: Array.isArray(state.jobs) ? state.jobs : [],
    messages: Array.isArray(state.messages) ? state.messages : [],
    documents: Array.isArray(state.documents) ? state.documents : [],
    reviews: Array.isArray(state.reviews) ? state.reviews : [],
    escrows: Array.isArray(state.escrows) ? state.escrows : [],
  };
}

async function supabaseUploadDocument(file: File, userKey: string) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${userKey}/${Date.now()}-${safeName}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/wanted-documents/${path}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'true',
    },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Belge yüklenemedi');
  }

  return {
    fileName: file.name,
    fileUrl: `${SUPABASE_URL}/storage/v1/object/public/wanted-documents/${path}`,
  };
}

export default function AppPage() {
  const [hydrated, setHydrated] = useState(false);
  const [lang, setLang] = useState<Lang>('tr');
  const t = translations[lang];
  const [role, setRole] = useState<Role>(null);
  const [page, setPage] = useState<Page>('neoHome');
  const [query, setQuery] = useState('');
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [requests, setRequests] = useState<RequestItem[]>(makeDemoRequests());
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [escrows, setEscrows] = useState<EscrowItem[]>([]);
  const [reviewTarget, setReviewTarget] = useState<JobItem | null>(null);
  const [messageDrafts, setMessageDrafts] = useState<Record<number, string>>({});
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [offerTarget, setOfferTarget] = useState<RequestItem | null>(null);
  const [offerDetail, setOfferDetail] = useState<OfferItem | null>(null);
  const [adminPassOpen, setAdminPassOpen] = useState(false);
  const [landingMenuOpen, setLandingMenuOpen] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [toast, setToast] = useState('');
  const [piPaymentStatus, setPiPaymentStatus] = useState('');

  const buyerReady = Boolean(profile.fullName && profile.phone && profile.location);
  const providerReady = Boolean(profile.fullName && profile.phone && profile.company && profile.profession);
  const providerVerified = documents.some((d) => d.userKey === 'provider-demo' && d.status === 'approved');
  const providerRating = useMemo(() => getReviewStats(reviews, 'provider-demo'), [reviews]);

useEffect(() => {
    try {
      let parsedData: any = null;

      for (const key of STORAGE_FALLBACK_KEYS) {
        const saved = localStorage.getItem(key);
        if (saved) {
          parsedData = JSON.parse(saved);
          break;
        }
      }

      if (parsedData) {
        const data = parsedData;
        if (data.lang === 'tr' || data.lang === 'en') setLang(data.lang);
        if (data.role) setRole(data.role);
        if (data.page) setPage(data.page);
        const safe = buildSafeSnapshot(data);
        if (safe.profile) setProfile(safe.profile);
        if (Array.isArray(safe.requests) && safe.requests.length) setRequests(safe.requests);
        if (Array.isArray(safe.offers)) setOffers(safe.offers);
        if (Array.isArray(safe.jobs)) setJobs(safe.jobs);
        if (Array.isArray(safe.messages)) setMessages(safe.messages);
        if (Array.isArray(safe.documents)) setDocuments(safe.documents);
        if (Array.isArray(safe.reviews)) setReviews(safe.reviews);
        if (Array.isArray(safe.escrows)) setEscrows(safe.escrows);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
        localStorage.setItem(PERMANENT_STORAGE_KEY, JSON.stringify(safe));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const previousRaw = localStorage.getItem(PERMANENT_STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    let previous: any = {};
    try { previous = previousRaw ? JSON.parse(previousRaw) : {}; } catch {}
    const safeProfile = isProfileFilled(profile) ? profile : mergeProfileSafe(defaultProfile, previous.profile || {});
    const snapshot = { lang, role, page, profile: safeProfile, requests, offers, jobs, messages, documents, reviews, escrows };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    localStorage.setItem(PERMANENT_STORAGE_KEY, JSON.stringify(snapshot));
  }, [hydrated, lang, role, page, profile, requests, offers, jobs, messages, documents, reviews, escrows]);

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allServices;
    return allServices.filter((s) => `${s.title} ${s.sector}`.toLowerCase().includes(q));
  }, [query]);

  const trendServices = allServices.filter((s) => s.trend).slice(0, 8);

  const providerVisibleRequests = useMemo(() => {
    if (!profile.services.length) return requests;
    return requests.filter((r) => profile.services.some((s) => s.includes(r.job) || s.includes(r.sector)));
  }, [requests, profile.services]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 2200);
  }

  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function loadPiSdkOnce() {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined') return reject(new Error('Tarayıcı ortamı hazır değil'));
      if (window.Pi) return resolve();

      const existing = document.getElementById('pi-sdk-script') as HTMLScriptElement | null;
      if (existing) {
        if (window.Pi) return resolve();
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Pi SDK yüklenemedi')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = 'pi-sdk-script';
      script.src = 'https://sdk.minepi.com/pi-sdk.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Pi SDK yüklenemedi'));
      document.body.appendChild(script);
    });
  }

  async function ensurePiSdkReady(forceInit = false) {
    setPiPaymentStatus('Pi SDK yükleniyor...');
    await loadPiSdkOnce();

    for (let i = 0; i < 40; i += 1) {
      if (window.Pi?.init) break;
      await wait(200);
    }

    if (!window.Pi?.init) {
      throw new Error('Pi SDK bulunamadı. Lütfen Pi Browser içinde tekrar dene.');
    }

    const alreadyInitialized = Boolean((window as any).__wantedPiInitialized);
    if (!alreadyInitialized || forceInit) {
      setPiPaymentStatus('Pi SDK başlatılıyor...');
      await Promise.resolve(window.Pi.init({ version: '2.0', sandbox: true }));
      (window as any).__wantedPiInitialized = true;
      await wait(1200);
    }

    if (!window.Pi?.authenticate || !window.Pi?.createPayment) {
      throw new Error('Pi SDK hazır değil. Sayfayı yenileyip Pi Browser içinde tekrar dene.');
    }
  }

  async function postPiServer(path: string, body: any) {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || 'Pi sunucu işlemi başarısız');
    return data;
  }

  async function startPiTestPayment() {
    try {
      await ensurePiSdkReady(true);

      const onIncompletePaymentFound = function(payment: any) {
        console.log('Incomplete Pi payment:', payment);
      };

      setPiPaymentStatus('Pi izin ekranı bekleniyor...');
      try {
        await window.Pi.authenticate(['payments'], onIncompletePaymentFound);
      } catch (authError: any) {
        const message = authError?.message || String(authError || '');
        if (message.toLowerCase().includes('not initialized') || message.toLowerCase().includes('init')) {
          (window as any).__wantedPiInitialized = false;
          await ensurePiSdkReady(true);
          await window.Pi.authenticate(['payments'], onIncompletePaymentFound);
        } else {
          throw authError;
        }
      }

      await wait(500);
      await ensurePiSdkReady(false);

      setPiPaymentStatus('Pi test ödeme ekranı açılıyor...');
      window.Pi.createPayment(
        {
          amount: 0.001,
          memo: 'Wanted.pi checklist test payment',
          metadata: { app: 'wanted.pi', type: 'mainnet-checklist-test', version: '27.7' },
        },
        {
          onReadyForServerApproval: async function(paymentId: string) {
            setPiPaymentStatus('Ödeme sunucuda onaylanıyor...');
            await postPiServer('/api/pi/approve', { paymentId });
          },
          onReadyForServerCompletion: async function(paymentId: string, txid: string) {
            setPiPaymentStatus('Ödeme tamamlanıyor...');
            await postPiServer('/api/pi/complete', { paymentId, txid });
            setPiPaymentStatus('Pi test ödeme tamamlandı ✅');
            showToast('Pi test ödeme tamamlandı');
          },
          onCancel: function(paymentId: string) {
            setPiPaymentStatus('Ödeme iptal edildi');
            console.log('Pi payment cancelled:', paymentId);
          },
          onError: function(error: any, payment?: any) {
            console.error('Pi payment error:', error, payment);
            const message = error?.message || error?.error || 'Bilinmeyen hata';
            setPiPaymentStatus('Pi ödeme hatası: ' + message);
            showToast('Pi ödeme hatası: ' + message);
          },
        }
      );
    } catch (error: any) {
      console.error('Pi test payment failed:', error);
      const message = error?.message || 'Pi test ödeme başlatılamadı';
      setPiPaymentStatus(message);
      showToast(message);
    }
  }

  function updateProfile(key: keyof Profile, value: any) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  function createRequest(form: any) {
    if (!selectedService) return;
    if (!buyerReady) {
      showToast(t.completeProfile);
      setPage('profile');
      return;
    }

    const newRequest: RequestItem = {
      id: Date.now(),
      serviceId: selectedService.id,
      title: `${selectedService.title} talebi`,
      sector: selectedService.sector,
      job: selectedService.title,
      name: profile.fullName,
      phone: profile.phone,
      location: profile.location,
      budget: form.budget,
      date: form.date,
      description: form.description,
      status: 'open',
      owner: 'me',
    };

    setRequests((prev) => [newRequest, ...prev]);
    setSelectedService(null);
    setPage('jobs');
    showToast(t.dbSaved);

    supabaseInsert('wanted_requests', {
      user_key: 'buyer-demo',
      title: newRequest.title,
      sector: newRequest.sector,
      job: newRequest.job,
      name: newRequest.name,
      phone: newRequest.phone,
      location: newRequest.location,
      budget: newRequest.budget,
      request_date: newRequest.date,
      description: newRequest.description,
      status: newRequest.status,
    });
  }

  function createOffer(form: any) {
    if (!offerTarget) return;
    if (!providerReady) {
      showToast(t.completeProvider);
      setPage('providerHome');
      return;
    }

    const newOffer: OfferItem = {
      id: Date.now(),
      requestId: offerTarget.id,
      requestTitle: offerTarget.title,
      sector: offerTarget.sector,
      job: offerTarget.job,
      providerName: profile.fullName,
      phone: profile.phone,
      company: profile.company,
      experience: profile.experience,
      certificate: profile.certificates,
      price: form.price,
      message: form.message,
      status: 'pending',
      feePaid: `${OFFER_FEE_PI} Pi (~₺${OFFER_FEE_TL})`,
    };

    setOffers((prev) => [newOffer, ...prev]);
    setRequests((prev) => prev.map((r) => r.id === offerTarget.id ? { ...r, status: 'offer_waiting' } : r));
    setOfferTarget(null);
    setPage('offers');
    showToast(t.offerSaved);

    supabaseInsert('wanted_offers', {
      user_key: 'provider-demo',
      request_id: newOffer.requestId,
      request_title: newOffer.requestTitle,
      sector: newOffer.sector,
      job: newOffer.job,
      name: newOffer.providerName,
      phone: newOffer.phone,
      company: newOffer.company,
      certificate: newOffer.certificate,
      experience: newOffer.experience,
      price: newOffer.price,
      description: newOffer.message,
      fee_paid: newOffer.feePaid,
      status: newOffer.status,
    });
  }

  function selectOffer(id: number) {
    const selected = offers.find((x) => x.id === id);
    if (!selected) return;

    setOffers((prev) => prev.map((o) => {
      if (o.id === id) return { ...o, status: 'selected' };
      if (selected && o.requestId === selected.requestId) return { ...o, status: 'ignored' };
      return o;
    }));

    setRequests((prev) => prev.map((r) => r.id === selected.requestId ? { ...r, status: 'in_progress' } : r));

    const newJob: JobItem = {
      id: Date.now(),
      requestId: selected.requestId,
      offerId: selected.id,
      buyerKey: 'buyer-demo',
      providerKey: 'provider-demo',
      title: selected.requestTitle,
      providerName: selected.providerName,
      company: selected.company,
      price: selected.price,
      status: 'started',
      startedAt: new Date().toISOString(),
    };

    setJobs((prev) => prev.some((j) => j.offerId === selected.id) ? prev : [newJob, ...prev]);

    const newEscrow: EscrowItem = {
      id: Date.now() + 1,
      jobId: newJob.id,
      requestId: selected.requestId,
      offerId: selected.id,
      buyerKey: newJob.buyerKey,
      providerKey: newJob.providerKey,
      amount: selected.price || '0',
      currency: 'Pi',
      paymentMethod: 'Demo Escrow',
      status: 'pending_funding',
      createdAt: new Date().toISOString(),
    };
    setEscrows((prev) => prev.some((e) => e.offerId === selected.id) ? prev : [newEscrow, ...prev]);
    showToast(t.selected);

    supabaseInsert('wanted_escrows', {
      job_id: String(newEscrow.jobId),
      request_id: String(newEscrow.requestId),
      offer_id: String(newEscrow.offerId),
      buyer_key: newEscrow.buyerKey,
      provider_key: newEscrow.providerKey,
      amount: newEscrow.amount,
      currency: newEscrow.currency,
      status: newEscrow.status,
      payment_method: newEscrow.paymentMethod,
    });

    supabaseInsert('wanted_jobs', {
      request_id: String(newJob.requestId),
      offer_id: String(newJob.offerId),
      buyer_key: newJob.buyerKey,
      provider_key: newJob.providerKey,
      title: newJob.title,
      status: newJob.status,
    });
  }

  function completeJob(jobId: number) {
    const job = jobs.find((j) => j.id === jobId);
    setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, status: 'completed', completedAt: new Date().toISOString() } : j));
    if (job) {
      setRequests((prev) => prev.map((r) => r.id === job.requestId ? { ...r, status: 'completed' } : r));
      setOffers((prev) => prev.map((o) => o.id === job.offerId ? { ...o, status: 'completed' } : o));
      supabaseInsert('wanted_jobs', {
        request_id: String(job.requestId),
        offer_id: String(job.offerId),
        buyer_key: job.buyerKey,
        provider_key: job.providerKey,
        title: job.title,
        status: 'completed',
        completed_at: new Date().toISOString(),
      });
    }
    showToast(t.jobCompleted);
    if (job && role === 'buyer') {
      setReviewTarget({ ...job, status: 'completed', completedAt: new Date().toISOString() });
    }
  }

  function submitReview(stars: number, comment: string) {
    if (!reviewTarget) return;
    const review: ReviewItem = {
      id: Date.now(),
      jobId: reviewTarget.id,
      providerKey: reviewTarget.providerKey || 'provider-demo',
      buyerKey: reviewTarget.buyerKey || 'buyer-demo',
      stars,
      comment,
      jobTitle: reviewTarget.title,
      providerName: reviewTarget.providerName,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [review, ...prev]);
    setReviewTarget(null);
    showToast(t.reviewSaved);

    supabaseInsert('wanted_reviews', {
      provider_key: review.providerKey,
      buyer_key: review.buyerKey,
      stars: review.stars,
      comment: `${review.jobTitle} — ${review.comment}`,
    });
  }

  function sendMessage(jobId: number) {
    const text = (messageDrafts[jobId] || '').trim();
    if (!text) return;
    const job = jobs.find((j) => j.id === jobId);
    const newMessage: MessageItem = {
      id: Date.now(),
      jobId,
      senderKey: role === 'provider' ? 'provider-demo' : 'buyer-demo',
      receiverKey: role === 'provider' ? 'buyer-demo' : 'provider-demo',
      message: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessageDrafts((prev) => ({ ...prev, [jobId]: '' }));
    supabaseInsert('wanted_messages', {
      job_id: String(jobId),
      sender_key: newMessage.senderKey,
      receiver_key: newMessage.receiverKey,
      message: newMessage.message,
    });
    if (job) showToast('Mesaj gönderildi');
  }

  async function submitDocument(file: File, documentType: string, serviceTitle?: string) {
    if (!providerReady) {
      showToast('Belge yüklemeden önce hizmet veren profilini tamamla');
      setPage('providerHome');
      return;
    }

    try {
      showToast('Belge yükleniyor...');
      const userKey = 'provider-demo';
      const uploaded = await supabaseUploadDocument(file, userKey);
      const newDocument: DocumentItem = {
        id: Date.now(),
        userKey,
        role: 'provider',
        fullName: profile.fullName,
        phone: profile.phone,
        company: profile.company,
        profession: serviceTitle || profile.profession,
        documentType,
        fileName: uploaded.fileName,
        fileUrl: uploaded.fileUrl,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setDocuments((prev) => [newDocument, ...prev]);
      updateProfile('certificates', uploaded.fileName);
      supabaseInsert('wanted_documents', {
        user_key: newDocument.userKey,
        role: newDocument.role,
        full_name: newDocument.fullName,
        phone: newDocument.phone,
        company: newDocument.company,
        profession: newDocument.profession,
        document_type: newDocument.documentType,
        file_name: newDocument.fileName,
        file_url: newDocument.fileUrl,
        status: newDocument.status,
      });
      showToast('Belge yüklendi, admin onayı bekliyor');
    } catch (error) {
      console.log('Document upload error:', error);
      showToast('Belge yüklenemedi. Bucket public ve policy kontrol et.');
    }
  }

  function setDocumentStatus(id: number, status: 'approved' | 'rejected') {
    const doc = documents.find((d) => d.id === id);
    setDocuments((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
    if (doc) {
      supabaseInsert('wanted_documents', {
        user_key: doc.userKey,
        role: doc.role,
        full_name: doc.fullName,
        phone: doc.phone,
        company: doc.company,
        profession: doc.profession,
        document_type: doc.documentType,
        file_name: doc.fileName,
        file_url: doc.fileUrl,
        status,
        admin_note: status === 'approved' ? 'Demo admin onayı' : 'Demo admin reddi',
      });
    }
    showToast(status === 'approved' ? 'Belge onaylandı' : 'Belge reddedildi');
  }

  function updateEscrowStatus(jobId: number, status: EscrowStatus, note?: string) {
    const now = new Date().toISOString();
    setEscrows((prev) => prev.map((e) => {
      if (e.jobId !== jobId) return e;
      return {
        ...e,
        status,
        fundedAt: status === 'funded' ? now : e.fundedAt,
        releasedAt: status === 'released' ? now : e.releasedAt,
        disputedAt: status === 'disputed' ? now : e.disputedAt,
      };
    }));
    const escrow = escrows.find((e) => e.jobId === jobId);
    if (escrow) {
      supabaseInsert('wanted_escrows', {
        job_id: String(escrow.jobId),
        request_id: String(escrow.requestId),
        offer_id: String(escrow.offerId),
        buyer_key: escrow.buyerKey,
        provider_key: escrow.providerKey,
        amount: escrow.amount,
        currency: escrow.currency,
        status,
        payment_method: escrow.paymentMethod,
        buyer_note: note || '',
        funded_at: status === 'funded' ? now : undefined,
        released_at: status === 'released' ? now : undefined,
        disputed_at: status === 'disputed' ? now : undefined,
      });
    }
    showToast(status === 'funded' ? 'Demo ödeme güvenli havuza alındı' : status === 'released' ? 'Ödeme serbest bırakıldı' : status === 'disputed' ? 'Sorun bildirildi' : 'Escrow güncellendi');
  }

  function ignoreOffer(id: number) {
    setOffers((prev) => prev.map((o) => o.id === id ? { ...o, status: 'ignored' } : o));
    showToast(t.ignored);
  }

  function saveProfile() {
    showToast('Profil kaydedildi');
    supabaseInsert('wanted_profiles', {
      user_key: `${role || 'user'}-demo`,
      role,
      full_name: profile.fullName,
      phone: profile.phone,
      tc_no: profile.tcNo,
      pi_wallet: profile.piWallet,
      location: profile.location,
      company: profile.company,
      profession: profile.profession,
      certificates: profile.certificates,
      experience: profile.experience,
      about: profile.about,
      iban: profile.iban,
      payment_preference: 'Pi Wallet',
    });
  }

  if (!hydrated) return <div className="min-h-screen bg-white flex items-center justify-center font-black">Wanted.pi yükleniyor...</div>;

  if (!role) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#EAF8F0_0,#F8FAFC_42%,#EEF2F6_100%)] text-[#141414] px-4 py-4 overflow-hidden">
        <PiDomainValidationHidden />
        <div className="max-w-md mx-auto min-h-[calc(100vh-32px)] flex flex-col relative">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setLandingMenuOpen(true)}
              className="w-12 h-12 rounded-2xl bg-white/90 border border-white shadow-[0_12px_30px_rgba(15,23,42,0.10)] flex items-center justify-center text-2xl font-black active:scale-[0.98]"
              aria-label="Menü"
            >
              ☰
            </button>
            <div className="flex items-center gap-2">
              <LanguageToggle lang={lang} setLang={setLang} />
              <div className="px-3 py-2 rounded-full bg-white/80 border border-white shadow-sm text-[11px] font-black text-[#12864F]">{lang === 'tr' ? 'Pi + Web3' : 'Pi + Web3'}</div>
            </div>
          </div>

          <LandingRoleButton
            title="Hizmet Al"
            desc="{lang === 'tr' ? 'Usta, uzman veya çalışan bul. Talep oluştur, teklifleri karşılaştır.' : 'Find a professional, create a request and compare offers.'}"
            icon={<Search size={28} />}
            tone="buyer"
            onClick={() => { setRole('buyer'); setPage('neoHome'); }}
          />

          <LandingWantedCenter />

          <LandingRoleButton
            title="Hizmet Ver"
            desc="Profilini oluştur, işlere teklif ver, Pi destekli pazarda görünür ol."
            icon={<Building2 size={28} />}
            tone="provider"
            onClick={() => { setRole('provider'); setPage('providerHome'); }}
          />

          <div className="grid grid-cols-3 gap-2 mt-3">
            <LandingMiniTrust label="Pi uyumlu" />
            <LandingMiniTrust label="KYC hedefli" />
            <LandingMiniTrust label="Güvenli pazar" />
          </div>

          {landingMenuOpen && (
            <BottomSheet onClose={() => setLandingMenuOpen(false)}>
              <div className="-m-6 mb-0 rounded-t-[34px] bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#042F2E] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.35)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center text-2xl font-black shadow-[0_0_22px_rgba(37,99,235,0.55)]">W</div>
                  <div>
                    <h2 className="text-[26px] leading-tight font-black">{lang === 'tr' ? 'Wanted.pi Menü' : 'Wanted.pi Menu'}</h2>
                    <p className="text-sm text-white/70">{lang === 'tr' ? 'İçindekiler ve hızlı araçlar' : 'Contents and quick tools'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <LandingMenuAction title="Hizmet Al" desc="Talep oluştur, usta bul" emoji="🔎" tone="orange" onClick={() => { setLandingMenuOpen(false); setRole('buyer'); setPage('neoHome'); }} />
                  <LandingMenuAction title="Hizmet Ver" desc="Teklif ver, iş bul" emoji="💼" tone="green" onClick={() => { setLandingMenuOpen(false); setRole('provider'); setPage('providerHome'); }} />
                  <LandingMenuAction title="Şifreler" desc="Giriş ve güvenlik tercihleri" emoji="🔐" tone="purple" onClick={() => alert('Şifreler alanı sonraki güncellemede aktif edilecek.')} />
                  <LandingMenuAction title="Ödemeler" desc="Pi Cüzdan, IBAN ve ödeme tercihleri" emoji="💳" tone="yellow" onClick={() => alert('Ödemeler alanı sonraki güncellemede aktif edilecek.')} />
                  <LandingMenuAction title="Arkadaşına tavsiye et" desc="Pi Tarayıcı, Telegram veya WhatsApp ile paylaş" emoji="🔗" tone="blue" onClick={shareWantedApp} />
                  <LandingMenuAction title="Uygulamayı değerlendir" desc="Kullanma deneyimini değerlendir" emoji="⭐" tone="pink" onClick={() => alert('Değerlendirme alanı sonraki güncellemede aktif edilecek.')} />
                  <div className="h-px bg-white/10 my-1" />
                  <LandingMenuAction title="Wanted ulaş" desc="Bizimle iletişime geç" emoji="✉️" tone="blue" onClick={() => alert('Wanted ulaş alanı sonraki güncellemede aktif edilecek.')} />
                  <LandingMenuAction title="Wanted sor" desc="Sık sorulan sorular" emoji="❓" tone="orange" onClick={() => alert('Wanted sor yardımcı alanı sonraki güncellemede aktif edilecek.')} />
                  <LandingMenuAction title="Reklam ver" desc="Hizmetini daha çok kişiye ulaştır" emoji="📣" tone="pink" onClick={() => alert('Reklam ver alanı sonraki güncellemede aktif edilecek.')} />
                </div>
              </div>
              <div className="pt-5">
                <WantedShareCard />
                <PiTestPaymentCard onClick={startPiTestPayment} status={piPaymentStatus} />
              </div>
            </BottomSheet>
          )}

          {adminPassOpen && (
            <BottomSheet onClose={() => setAdminPassOpen(false)}>
              <h2 className="text-[24px] leading-tight font-black text-[#101828] mb-3">{t.adminPanel}</h2>
              <Input label={t.password} value={adminPass} onChange={setAdminPass} />
              <button
                onClick={() => {
                  if (adminPass === ADMIN_PASS) {
                    setRole('admin');
                    setPage('adminHome');
                    setAdminPassOpen(false);
                    setAdminPass('');
                  } else showToast(t.wrongPass);
                }}
                className="w-full mt-3 py-4 rounded-2xl bg-[#111] text-white font-black"
              >
                {t.save}
              </button>
            </BottomSheet>
          )}

          {toast && <Toast message={toast} />}
        </div>
      </div>
    );
  }

  if (role === 'provider') {
    return (
      <Shell t={t} role={role} setRole={setRole} setPage={setPage} lang={lang} setLang={setLang}>
        {page === 'providerHome' && <ProviderHome t={t} profile={profile} providerReady={providerReady} providerVerified={providerVerified} providerRating={providerRating} documents={documents} reviews={reviews} updateProfile={updateProfile} saveProfile={saveProfile} submitDocument={submitDocument} />}
        {page === 'jobs' && <ProviderJobs t={t} requests={providerVisibleRequests} onOffer={setOfferTarget} />}
        {page === 'offers' && <ProviderOffers t={t} offers={offers} jobs={jobs} messages={messages} messageDrafts={messageDrafts} setMessageDrafts={setMessageDrafts} sendMessage={sendMessage} completeJob={completeJob} />}
        {page === 'notifications' && <Notifications />}
        {page === 'profile' && <ProfilePage t={t} role={role} profile={profile} updateProfile={updateProfile} saveProfile={saveProfile} />}
        {page === 'providerSettings' && <ProviderSettingsPage t={t} profile={profile} setPage={setPage} setRole={setRole} />}
        {page === 'serviceAdd' && <ServiceAddPage t={t} profile={profile} documents={documents} updateProfile={updateProfile} showToast={showToast} submitDocument={submitDocument} />}
      {page === 'settings' && <BuyerSettingsPage t={t} profile={profile} setPage={setPage} setRole={setRole} />}
        <BottomNav role={role} page={page} setPage={setPage} t={t} />

        {offerTarget && (
          <BottomSheet onClose={() => setOfferTarget(null)}>
            <OfferForm t={t} request={offerTarget} onSave={createOffer} />
          </BottomSheet>
        )}

        {toast && <Toast message={toast} />}
      </Shell>
    );
  }

  if (role === 'admin') {
    return (
      <Shell t={t} role={role} setRole={setRole} setPage={setPage} lang={lang} setLang={setLang}>
        <AdminHome t={t} requests={requests} offers={offers} documents={documents} reviews={reviews} setDocumentStatus={setDocumentStatus} profile={profile} setRole={setRole} />
        {toast && <Toast message={toast} />}
      </Shell>
    );
  }

  return (
    <Shell t={t} role={role} setRole={setRole} setPage={setPage} lang={lang} setLang={setLang}>
      {page === 'neoHome' && (
        <BuyerNeoHome
          t={t}
          query={query}
          setQuery={setQuery}
          trendServices={trendServices}
          sections={serviceSections}
          filteredServices={filteredServices}
          onSelectService={setSelectedService}
        />
      )}

      {page === 'jobs' && <BuyerJobs t={t} requests={requests.filter((r) => r.owner === 'me')} offers={offers} onOfferClick={setOfferDetail} />}
      {page === 'offers' && <BuyerIncomingOffers t={t} offers={offers} jobs={jobs} messages={messages} reviews={reviews} messageDrafts={messageDrafts} setMessageDrafts={setMessageDrafts} sendMessage={sendMessage} completeJob={completeJob} onReview={setReviewTarget} selectOffer={selectOffer} ignoreOffer={ignoreOffer} />}
      {page === 'notifications' && <Notifications />}
      {page === 'profile' && <ProfilePage t={t} role={role} profile={profile} updateProfile={updateProfile} saveProfile={saveProfile} />}
      {page === 'settings' && <BuyerSettingsPage t={t} profile={profile} setPage={setPage} setRole={setRole} />}

      {selectedService && (
        <BottomSheet onClose={() => setSelectedService(null)}>
          {buyerReady ? <RequestWizard t={t} service={selectedService} onSave={createRequest} /> : <RequiredProfile t={t} onGoProfile={() => { setSelectedService(null); setPage('profile'); }} />}
        </BottomSheet>
      )}

      {offerDetail && (
        <BottomSheet onClose={() => setOfferDetail(null)}>
          <OfferDetail t={t} offer={offerDetail} selectOffer={selectOffer} ignoreOffer={ignoreOffer} />
        </BottomSheet>
      )}

      {reviewTarget && (
        <BottomSheet onClose={() => setReviewTarget(null)}>
          <ReviewForm t={t} job={reviewTarget} onSave={submitReview} />
        </BottomSheet>
      )}

      <BottomNav role={role} page={page} setPage={setPage} t={t} />
      {toast && <Toast message={toast} />}
    </Shell>
  );
}



function LandingWantedCenter() {
  return (
    <div className="flex-1 min-h-[270px] rounded-[36px] bg-gradient-to-br from-white via-[#F8FBFF] to-[#EEF7FF] border border-white shadow-[0_24px_70px_rgba(15,23,42,0.10)] my-3 p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#2563EB]/12 blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/70 to-transparent" />

      <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-[#075985] via-[#1D4ED8] to-[#38BDF8] shadow-[0_0_70px_rgba(37,99,235,0.42)] flex items-center justify-center border-[6px] border-[#F4D06F]/80">
        <div className="absolute inset-[-10px] rounded-full border-2 border-[#60A5FA]/40 animate-[orbitSpin_7s_linear_infinite]" />
        <div
          className="absolute inset-[-18px] rounded-full border-[4px] animate-[orbitReverse_5.2s_linear_infinite]"
          style={{ borderColor: '#EF4444 transparent #F59E0B #EF4444' }}
        />
        <div className="absolute inset-[-34px] rounded-full animate-[orbitSpin_9s_linear_infinite]">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 h-[3px] w-8 origin-left rounded-full bg-[#60A5FA]/70 shadow-[0_0_14px_rgba(96,165,250,0.95)]"
              style={{ transform: `rotate(${i * 20}deg) translateX(74px)` }}
            />
          ))}
        </div>
        <div className="absolute w-5 h-5 rounded-full bg-white shadow-[0_0_18px_rgba(96,165,250,0.95)] -left-2 top-1/2" />
        <div className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_18px_rgba(96,165,250,0.95)] -right-1 top-[56%]" />
        <span className="relative text-[82px] leading-none font-black text-white drop-shadow-[0_7px_10px_rgba(0,0,0,0.35)]">W</span>
      </div>

      <div className="mt-5 flex items-center justify-center gap-1">
        <h1 className="text-[46px] leading-none font-black tracking-tight text-[#0B1F17]">Wanted</h1>
        <span className="text-[46px] leading-none font-black text-[#16A34A]">.pi</span>
      </div>
      <div className="mt-3 h-7 flex justify-center overflow-hidden">
        <p className="text-[17px] font-black text-[#16A34A] whitespace-nowrap overflow-hidden border-r-2 border-[#16A34A] animate-[typeOnce_2.8s_steps(28)_forwards]">Arayan bulur, çalışan kazanır.</p>
      </div>
      <p className="mt-2 text-sm text-[#667085] max-w-xs leading-relaxed opacity-0 animate-[fadeInText_1s_ease-out_2.7s_forwards]">{lang === 'tr' ? 'Pi ekosistemi için sade, hızlı ve güven veren hizmet pazarı.' : 'A simple, fast and trusted service marketplace for the Pi ecosystem.'}</p>
      <style>{`
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbitReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes typeOnce {
          from { width: 0; }
          to { width: 270px; }
        }
        @keyframes fadeInText {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function LandingRoleButton({ title, desc, icon, tone, onClick }: any) {
  const style = tone === 'buyer'
    ? 'bg-gradient-to-br from-[#FFF7ED] to-white border-[#FDBA74] text-[#C2410C]'
    : 'bg-gradient-to-br from-[#ECFDF3] to-white border-[#86EFAC] text-[#0B5E37]';

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-[30px] border ${style} p-4 flex items-center gap-4 text-left shadow-[0_18px_45px_rgba(15,23,42,0.08)] active:scale-[0.99]`}
    >
      <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-sm text-[#12864F]">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-[26px] leading-tight font-black text-[#101828]">{title}</h3>
        <p className="text-sm text-[#667085] mt-1 leading-snug">{desc}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#475467]"><ChevronRight size={22} /></div>
    </button>
  );
}

function LandingMiniTrust({ label }: any) {
  return (
    <div className="rounded-2xl bg-white/85 border border-white px-2 py-3 text-center shadow-sm">
      <div className="text-[#16A34A] font-black text-lg">✓</div>
      <div className="text-[11px] font-black text-[#475467] leading-tight">{label}</div>
    </div>
  );
}

function LandingMenuAction({ title, desc, emoji, tone, onClick }: any) {
  const tones: any = {
    blue: 'from-[#0EA5E9] to-[#2563EB]',
    purple: 'from-[#8B5CF6] to-[#6D28D9]',
    orange: 'from-[#F97316] to-[#EA580C]',
    green: 'from-[#22C55E] to-[#15803D]',
    yellow: 'from-[#FBBF24] to-[#D97706]',
    pink: 'from-[#EC4899] to-[#BE185D]',
  };
  return (
    <button
      onClick={onClick}
      className="w-full rounded-3xl border border-white/10 bg-white/6 p-3 flex items-center gap-3 text-left shadow-sm active:scale-[0.99] hover:bg-white/10 transition-all"
    >
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tones[tone] || tones.blue} flex items-center justify-center text-2xl shadow-[0_0_18px_rgba(255,255,255,0.14)]`}>{emoji}</div>
      <div className="flex-1">
        <h3 className="text-lg font-black text-white">{title}</h3>
        <p className="text-xs text-white/65 mt-1 leading-snug">{desc}</p>
      </div>
      <ChevronRight size={20} className="text-white/55" />
    </button>
  );
}

function WantedShareCard() {
  return (
    <div className="mb-5 rounded-[28px] bg-[#F0FDF4] border border-[#BBF7D0] shadow-[0_12px_34px_rgba(22,163,74,0.08)] p-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center font-black">↗</div>
        <div className="flex-1">
          <h3 className="font-black text-[#101828] text-lg">Wanted.pi paylaş</h3>
          <p className="text-sm text-[#667085] mt-1">Telegram, WhatsApp veya Pi Browser destek mesajını tek dokunuşla paylaş.</p>
        </div>
      </div>
      <button
        onClick={shareWantedApp}
        className="w-full mt-4 py-4 rounded-2xl bg-[#16A34A] text-white font-black active:scale-[0.99]"
      >
        Davet Mesajını Paylaş / Kopyala
      </button>
    </div>
  );
}

function PiTestPaymentCard({ onClick, status }: any) {
  return (
    <div className="mb-5 rounded-[28px] bg-white border border-[#D1FADF] shadow-[0_14px_40px_rgba(15,23,42,0.07)] p-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#27C267] text-white flex items-center justify-center font-black">π</div>
        <div className="flex-1">
          <h3 className="font-black text-[#101828] text-lg">Pi Test Ödeme</h3>
          <p className="text-sm text-[#667085] mt-1">Uygulama artık açılışta Pi girişine zorlamaz. Pi işlemi sadece bu butona basınca başlar.</p>
        </div>
      </div>
      <button
        onClick={onClick}
        className="w-full mt-4 py-4 rounded-2xl bg-[#111] text-white font-black active:scale-[0.99]"
      >
        Pi Test Ödeme Yap
      </button>
      {status && <p className="mt-3 text-sm font-bold text-[#15803D]">{status}</p>}
    </div>
  );
}

function PiDomainValidationHidden() {
  return (
    <div
      id="pi-domain-validation"
      data-validation-key={PI_DOMAIN_VALIDATION_KEY}
      style={{ display: 'none' }}
    >
      {PI_DOMAIN_VALIDATION_KEY}
    </div>
  );
}


function LanguageToggle({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  const active = lang;
  return (
    <div className="flex items-center gap-1 rounded-full bg-white/80 border border-white/80 p-1 shadow-[0_10px_28px_rgba(15,23,42,0.10)] backdrop-blur-xl">
      <button
        onClick={() => setLang('tr')}
        className={`px-2.5 py-1.5 rounded-full text-[12px] font-black transition-all ${active === 'tr' ? 'bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white shadow-[0_0_16px_rgba(239,68,68,0.35)]' : 'text-[#667085]'}`}
        title="Türkçe"
      >
        🇹🇷 TR
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-2.5 py-1.5 rounded-full text-[12px] font-black transition-all ${active === 'en' ? 'bg-gradient-to-r from-[#16A34A] to-[#2563EB] text-white shadow-[0_0_16px_rgba(37,99,235,0.35)]' : 'text-[#667085]'}`}
        title="English"
      >
        🇬🇧 EN
      </button>
    </div>
  );
}

function Shell({ children, t, role, setRole, setPage, lang, setLang }: any) {
  return (
    <div className="h-screen bg-[radial-gradient(circle_at_top_left,#EAF8F0_0,#F7F8FA_34%,#F3F5F7_100%)] text-[#101828] overflow-hidden">
      <PiDomainValidationHidden />
      <div className="max-w-md mx-auto h-full flex flex-col relative bg-[#F8FAFC]/95 shadow-[0_24px_80px_rgba(15,23,42,0.10)] border-x border-white/70">
        <header className="px-5 pt-5 pb-3 bg-white/75 backdrop-blur-xl border-b border-white/80 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setRole(null)}
              className="text-left flex items-center gap-3 active:scale-[0.99] transition-transform"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0B5E37] via-[#12864F] to-[#00B86B] shadow-[0_10px_30px_rgba(39,194,103,0.28)] flex items-center justify-center text-white border border-white/80">
                <Home size={20} />
              </div>
              <div>
                <h1 className="text-[24px] leading-tight font-black text-[#101828] tracking-tight text-[#101828] leading-none">{t.app}</h1>
                <p className="text-xs text-[#15803D] font-bold mt-1">{role === 'buyer' ? t.buyer : role === 'provider' ? t.provider : t.admin}</p>
              </div>
            </button>
            <div className="flex items-center gap-2">
              <LanguageToggle lang={lang} setLang={setLang} />
              <span className="text-[11px] font-bold text-[#667085] bg-white border border-[#EAECF0] px-3 py-1.5 rounded-full shadow-sm">{role === 'buyer' ? 'Hizmet Alan' : role === 'provider' ? 'Hizmet Veren' : 'Admin'}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-5 pb-32 pt-3">{children}</main>
      </div>
    </div>
  );
}


function PremiumWantedHero({ role }: any) {
  return (
    <div className="relative text-center py-8">
      <div className="relative mx-auto w-36 h-36 rounded-full bg-gradient-to-br from-[#062B1F] via-[#0B5E37] to-[#0ABF6A] shadow-[0_0_45px_rgba(39,194,103,0.35)] flex items-center justify-center">
        <div className="absolute inset-[-10px] rounded-full border-2 border-[#60A5FA]/50 animate-[spinSlow_7s_linear_infinite]" />
        <div className="absolute inset-[-20px] rounded-full border-[3px] animate-[spinReverse_10s_linear_infinite]" style={{ borderColor: '#EF4444 transparent #60A5FA #EF4444' }} />
        <div className="absolute inset-[-32px] rounded-full animate-[spinSlow_9s_linear_infinite]">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="absolute left-1/2 top-1/2 h-[3px] w-7 origin-left rounded-full bg-[#60A5FA]/70 shadow-[0_0_14px_rgba(96,165,250,0.9)]" style={{ transform: `rotate(${i * 22.5}deg) translateX(68px)` }} />
          ))}
        </div>
        <span className="text-7xl font-black text-[#2563EB] drop-shadow-[0_0_14px_rgba(96,165,250,0.85)]">W</span>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        <h1 className="text-5xl font-black tracking-tight text-[#111]">Wanted</h1>
        <span className="text-5xl font-black text-[#27C267]">.pi</span>
      </div>

      <div className="h-8 mt-3 overflow-hidden">
        <p className="text-lg font-black text-[#27C267] animate-[typeOnce_2.8s_steps(28)_forwards] whitespace-nowrap mx-auto border-r-2 border-[#27C267] max-w-fit">
          Arayan bulur, çalışan kazanır.
        </p>
      </div>

      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes typeOnce {
          from { width: 0; }
          to { width: 270px; }
        }
      `}</style>
    </div>
  );
}

function BuyerNeoHome({ t, query, setQuery, trendServices, sections, filteredServices, onSelectService }: any) {
  const liveResults = query.trim() ? filteredServices.slice(0, 10) : [];
  return (
    <div className="space-y-8">
      <div className="pt-4 text-center">
        <div className="inline-flex items-center gap-3 mb-5 px-4 py-3 rounded-[28px] bg-white/85 border border-[#EAECF0] shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
          <div className="w-10 h-10 rounded-full bg-[#27C267] flex items-center justify-center text-white font-black">W</div>
          <div className="text-left">
            <h1 className="text-[34px] leading-none font-black tracking-tight text-[#101828] whitespace-nowrap overflow-hidden border-r-2 border-[#27C267] animate-[buyerTitleType_1.9s_steps(16)_forwards]">Wanted.pi</h1>
            <p className="text-xs font-bold text-[#16A34A] mt-1">Doğru hizmeti bul, talebini oluştur.</p>
          </div>
        </div>
        <style>{`
          @keyframes buyerTitleType {
            from { width: 0; }
            to { width: 178px; }
          }
          @keyframes buyerMiniSlide {
            0% { transform: translateX(0); }
            28% { transform: translateX(0); }
            36% { transform: translateX(-100%); }
            64% { transform: translateX(-100%); }
            72% { transform: translateX(-200%); }
            100% { transform: translateX(-200%); }
          }
        `}</style>

        <div className="mb-4 overflow-hidden rounded-[28px] border border-[#FDBA74]/70 bg-white shadow-[0_12px_32px_rgba(194,65,12,0.08)]">
          <div className="flex w-[300%] animate-[buyerMiniSlide_8s_ease-in-out_infinite]">
            {[
              { title: 'Gerçek profesyonellerle çalış', text: 'Doğrulanabilir profil ve hizmet geçmişiyle güvenli seçim yap.', icon: '✅', bg: 'from-[#ECFDF3] to-white', color: '#15803D' },
              { title: 'Teklifleri karşılaştır', text: 'Fiyat, deneyim ve belge durumuna göre en doğru kişiyi seç.', icon: '⚖️', bg: 'from-[#EFF6FF] to-white', color: '#1D4ED8' },
              { title: 'Dakikalar içinde talep oluştur', text: 'İhtiyacını yaz, uygun hizmet verenler sana teklif versin.', icon: '📝', bg: 'from-[#FFF7ED] to-white', color: '#C2410C' },
            ].map((x) => (
              <div key={x.title} className={`w-1/3 shrink-0 p-4 bg-gradient-to-br ${x.bg} flex items-center gap-3 text-left`}>
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm">{x.icon}</div>
                <div>
                  <h3 className="font-black text-[#101828] text-lg">{x.title}</h3>
                  <p className="text-xs text-[#667085] leading-snug">{x.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-full bg-white p-2 shadow-[0_12px_32px_rgba(15,23,42,0.12)] border border-gray-100 flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hangi hizmete ihtiyacın var?"
            className="flex-1 px-5 py-4 outline-none text-lg bg-transparent text-[#111] placeholder:text-gray-400"
          />
          <button className="w-14 h-14 rounded-full bg-[#27C267] text-white flex items-center justify-center shadow-lg">
            <Search size={26} />
          </button>
        </div>

        {liveResults.length > 0 && (
          <div className="mt-3 rounded-[28px] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden text-left">
            <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
              <span className="font-black text-[#111]">Uygun hizmetler</span>
              <span className="text-sm text-[#27C267] font-black">{filteredServices.length} eşleşme</span>
            </div>
            {liveResults.map((s: Service) => (
              <ServiceSearchResult key={s.id} service={s} onClick={() => onSelectService(s)} />
            ))}
          </div>
        )}
      </div>

      {!query.trim() && (
        <>
          <ServiceRow title="Trend Olan Hizmetler" services={trendServices} onSelect={onSelectService} />
          {sections.filter((section: any) => section.title !== 'Trend Hizmetler').map((section: any) => (
            <ServiceRow key={section.title} title={section.title} services={section.services} onSelect={onSelectService} />
          ))}
        </>
      )}
    </div>
  );
}

function ServicePhoto({ service, compact = false }: any) {
  return (
    <div className={`${compact ? 'w-16 h-14 rounded-2xl' : 'h-28 rounded-[22px]'} relative overflow-hidden bg-[#EAF8F0] shadow-sm border border-gray-100`}>
      <img
        src={service.image || IMG.digital}
        alt={service.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-white/5" />
    </div>
  );
}

function ServiceRow({ title, services, onSelect }: any) {
  return (
    <section>
      <h2 className="text-[28px] leading-tight font-black text-[#101828] mb-4 text-[#111]">{title}</h2>
      <div className="flex gap-5 overflow-x-auto pb-3 -mx-1 px-1">
        {services.map((service: Service) => (
          <button key={service.id} onClick={() => onSelect(service)} className="shrink-0 w-44 text-left">
            <ServicePhoto service={service} />
            <p className="mt-3 text-xl font-black text-[#101828] leading-tight text-[#111]">{service.title}</p>
            <p className="text-sm text-[#667085]">{service.sector}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function ServiceSearchResult({ service, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full px-4 py-3 hover:bg-[#F8FAFC] flex items-center gap-3 text-left border-b last:border-b-0 border-gray-100">
      <ServicePhoto service={service} compact />
      <div className="flex-1">
        <h3 className="font-black text-lg text-[#111]">{service.title}</h3>
        <p className="text-sm text-[#667085]">{service.sector}</p>
      </div>
      <ChevronRight className="text-gray-400" />
    </button>
  );
}

function ServiceTile({ service, onClick }: any) {
  return (
    <button onClick={onClick} className="text-left rounded-3xl bg-white p-4 shadow-sm border border-gray-100">
      <ServicePhoto service={service} />
      <h3 className="font-black mt-3 text-lg text-[#111]">{service.title}</h3>
      <p className="text-sm text-[#667085]">{service.sector}</p>
    </button>
  );
}

function RequestWizard({ t, service, onSave }: any) {
  const [form, setForm] = useState({ budget: '', date: '', description: '' });
  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  return (
    <div className="space-y-4">
      <div><p className="text-sm text-[#27C267] font-bold">Seçilen Hizmet</p><h2 className="text-[28px] leading-tight font-black text-[#101828]">{service.icon} {service.title}</h2><p className="text-[#667085]">{service.sector}</p></div>
      <Input label={t.budget} value={form.budget} onChange={(v: string) => update('budget', v)} />
      <Input label={t.date} value={form.date} onChange={(v: string) => update('date', v)} />
      <textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder={t.description} className="w-full rounded-2xl bg-[#F1F3F5] p-4 outline-none min-h-28" />
      <button onClick={() => onSave(form)} className="w-full py-4 rounded-2xl bg-[#27C267] text-white font-black text-lg">{t.createRequest}</button>
    </div>
  );
}

function OfferForm({ t, request, onSave }: any) {
  const [form, setForm] = useState({ price: '', message: '' });
  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  return (
    <div className="space-y-4">
      <div><p className="text-sm text-[#27C267] font-bold">{request.sector}</p><h2 className="text-[24px] leading-tight font-black text-[#101828]">{request.title}</h2><p className="text-[#667085]">{request.location} • {request.budget}</p></div>
      <Input label={t.price} value={form.price} onChange={(v: string) => update('price', v)} />
      <textarea value={form.message} onChange={(e) => update('message', e.target.value)} placeholder={t.message} className="w-full rounded-2xl bg-[#F1F3F5] p-4 outline-none min-h-28" />
      <button onClick={() => onSave(form)} className="w-full py-4 rounded-2xl bg-[#27C267] text-white font-black text-lg">{t.createOffer}</button>
    </div>
  );
}

function RequiredProfile({ t, onGoProfile }: any) {
  return (
    <div className="space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-[#FFF4EA] text-[#FF7A00] flex items-center justify-center"><User size={32} /></div>
      <h2 className="text-[24px] leading-tight font-black text-[#101828]">{t.completeProfile}</h2>
      <p className="text-[#667085]">Ad soyad, telefon ve konum bilgisi tamamlanınca talep oluşturabilirsin.</p>
      <button onClick={onGoProfile} className="w-full py-4 rounded-2xl bg-[#27C267] text-white font-black">Profili Doldur</button>
    </div>
  );
}

function BuyerJobs({ t, requests, offers, onOfferClick }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-[28px] leading-tight font-black text-[#101828]">{t.jobs}</h2>
      {requests.length === 0 ? <EmptyState title="Henüz talep yok" text="Hizmet Al ekranından ilk talebini oluştur." /> : requests.map((r: RequestItem) => {
        const count = offers.filter((o: OfferItem) => o.requestId === r.id).length;
        return (
          <div key={r.id} className="rounded-[30px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] border border-[#EAECF0]">
            <h3 className="text-xl font-black text-[#101828]">{r.title}</h3>
            <p className="text-[#667085]">{r.sector} / {r.job}</p>
            <p className="mt-2">{r.description}</p>
            <div className="mt-3 flex justify-between">
              <span className="font-black text-[#27C267]">{r.budget || '-'}</span>
              <span className="text-sm bg-[#EAF8F0] text-[#27C267] rounded-full px-3 py-1">{count} teklif</span>
            </div>
            {count > 0 && <button onClick={() => onOfferClick(offers.find((o: OfferItem) => o.requestId === r.id))} className="w-full mt-4 py-3 rounded-2xl bg-[#111] text-white font-black">Gelen Teklifleri Gör</button>}
          </div>
        );
      })}
    </div>
  );
}

function BuyerIncomingOffers({ t, offers, jobs, messages, reviews, escrows, updateEscrowStatus, messageDrafts, setMessageDrafts, sendMessage, completeJob, onReview, selectOffer, ignoreOffer }: any) {
  return (
    <div className="space-y-5">
      <h2 className="text-[28px] leading-tight font-black text-[#101828]">{t.incomingOffers}</h2>

      <ActiveJobsPanel
        t={t}
        jobs={jobs}
        messages={messages}
        escrows={escrows}
        updateEscrowStatus={updateEscrowStatus}
        messageDrafts={messageDrafts}
        setMessageDrafts={setMessageDrafts}
        sendMessage={sendMessage}
        completeJob={completeJob}
        reviews={reviews}
        onReview={onReview}
        mode="buyer"
      />

      {offers.length === 0 ? <EmptyState title="Henüz teklif yok" text="Talep oluşturunca gelen teklifler burada görünür." /> : offers.map((o: OfferItem) => (
        <OfferCard key={o.id} offer={o} t={t} selectOffer={selectOffer} ignoreOffer={ignoreOffer} />
      ))}
    </div>
  );
}

function OfferDetail({ t, offer, selectOffer, ignoreOffer }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-[24px] leading-tight font-black text-[#101828]">{offer.company}</h2>
      <p className="text-[#667085]">{offer.providerName} • {offer.experience}</p>
      <div className="rounded-3xl bg-[#F8FAFC] p-4"><b>{offer.price}</b><p>{offer.message}</p></div>
      <button onClick={() => selectOffer(offer.id)} className="w-full py-4 rounded-2xl bg-[#27C267] text-white font-black">{t.selectOffer}</button>
      <button onClick={() => ignoreOffer(offer.id)} className="w-full py-4 rounded-2xl bg-gray-200 text-[#111] font-black">{t.ignoreOffer}</button>
    </div>
  );
}

function OfferCard({ offer, t, selectOffer, ignoreOffer }: any) {
  return (
    <div className="rounded-[30px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] border border-[#EAECF0]">
      <h3 className="text-xl font-black text-[#101828]">{offer.company}</h3>
      <p className="text-[#667085]">{offer.requestTitle}</p>
      <p className="mt-2">{offer.message}</p>
      <div className="mt-3 flex justify-between"><b className="text-[#27C267]">{offer.price}</b><span>{offer.status}</span></div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button onClick={() => selectOffer(offer.id)} className="py-3 rounded-2xl bg-[#27C267] text-white font-black">{t.selectOffer}</button>
        <button onClick={() => ignoreOffer(offer.id)} className="py-3 rounded-2xl bg-gray-200 font-black">{t.ignoreOffer}</button>
      </div>
    </div>
  );
}


function TrustBadge({ active, label }: any) {
  return (
    <div className={`rounded-2xl px-3 py-3 border text-sm font-black flex items-center gap-2 ${active ? 'bg-[#00FFAA]/12 border-[#00FFAA]/35 text-[#B7FFE1]' : 'bg-white/5 border-white/10 text-gray-400'}`}>
      {active ? <CheckCircle size={17} /> : <ShieldCheck size={17} />}
      {label} {active ? '✔' : 'Bekliyor'}
    </div>
  );
}

function ProviderHome({ t, profile, providerReady, providerVerified, providerRating, documents, reviews, updateProfile, saveProfile, submitDocument }: any) {
  const approvedDocs = documents?.filter((d: DocumentItem) => d.status === 'approved') || [];
  const pendingDocs = documents?.filter((d: DocumentItem) => d.status === 'pending') || [];
  const rejectedDocs = documents?.filter((d: DocumentItem) => d.status === 'rejected') || [];
  const trustScore = Math.min(100,
    (profile.fullName ? 15 : 0) +
    (profile.phone ? 15 : 0) +
    (profile.piWallet ? 15 : 0) +
    (profile.iban ? 10 : 0) +
    (profile.company ? 10 : 0) +
    (profile.services?.length ? 10 : 0) +
    (approvedDocs.length ? 20 : 0) +
    (providerRating.count ? 5 : 0)
  );

  return (
    <div className="space-y-5">
      <PremiumWantedHero role="provider" />

      <div className="grid grid-cols-1 gap-3">
        {[
          { title: 'Hazır müşterilere ulaş', text: 'Açık talepleri gör, uygun işlere hızlı teklif ver.', icon: '🎯', tone: 'from-[#DBEAFE] to-white' },
          { title: 'Profilini profesyonel göster', text: 'Belge, deneyim ve yorumlarla güven puanını büyüt.', icon: '⭐', tone: 'from-[#ECFDF3] to-white' },
          { title: 'Pi destekli pazarda kazan', text: 'Web3 hizmet ekonomisinde görünür ol ve iş hacmini artır.', icon: 'π', tone: 'from-[#FFF7ED] to-white' },
        ].map((x) => (
          <div key={x.title} className={`rounded-[26px] bg-gradient-to-br ${x.tone} border border-white p-4 flex items-center gap-3 shadow-[0_12px_32px_rgba(15,23,42,0.07)]`}>
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm font-black text-[#12864F]">{x.icon}</div>
            <div>
              <h3 className="font-black text-[#101828] text-lg">{x.title}</h3>
              <p className="text-sm text-[#667085] leading-snug">{x.text}</p>
            </div>
          </div>
        ))}
      </div>

      {!providerReady && <div className="rounded-3xl bg-[#FFF4EA] p-5 border border-[#FFD0A3]"><h2 className="text-[24px] leading-tight font-black text-[#101828] text-[#FF7A00]">{t.completeProvider}</h2><p className="text-[#475467] mt-1">Firma/şahıs, telefon ve meslek bilgilerini doldur.</p></div>}
      <div className="rounded-[30px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] border border-[#EAECF0]">
        <h2 className="text-[28px] leading-tight font-black text-[#101828]">Hizmet Veren Paneli</h2>
        <p className="text-[#667085] mt-1">{providerReady ? (providerVerified ? 'Profil aktif ve doğrulanmış.' : 'Profil aktif, belge onayı bekleyebilir.') : 'Kayıt eksik.'}</p>
        <div className="grid grid-cols-3 gap-3 mt-4"><MiniStat icon={<Star />} label={providerRating.count ? providerRating.avg : 'Yeni'} /><MiniStat icon={<Briefcase />} label={profile.services.length} /><MiniStat icon={providerVerified ? <BadgeCheck /> : <ShieldCheck />} label={providerVerified ? 'Onaylı' : 'Pending'} /></div>
        {providerVerified && <div className="mt-4 rounded-2xl bg-[#EAF8F0] border border-[#27C267] p-3 flex items-center gap-2 text-[#15803D] font-black"><BadgeCheck size={20} /> Doğrulanmış Uzman rozeti aktif</div>}
        {!providerVerified && documents?.length > 0 && <div className="mt-4 rounded-2xl bg-[#FFF4EA] border border-[#FFD0A3] p-3 text-[#FF7A00] font-black">{documents.length} belge admin onayı bekliyor</div>}
      </div>

      <div className="rounded-[32px] bg-[#0B1220] text-white p-5 shadow-lg border border-[#1F2937]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[#00FFAA] font-black text-sm">Wanted Trust</p>
            <h3 className="text-[28px] leading-tight font-black text-[#101828] mt-1">{trustScore}/100 Güven Puanı</h3>
            <p className="text-gray-300 text-sm mt-1">Profil, belge, cüzdan ve yorumlara göre demo güven skoru.</p>
          </div>
          <div className="w-20 h-20 rounded-full bg-[#00FFAA]/15 border border-[#00FFAA]/40 flex items-center justify-center">
            <ShieldCheck className="text-[#00FFAA]" size={34} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <TrustBadge active={Boolean(profile.phone)} label="Telefon" />
          <TrustBadge active={Boolean(profile.piWallet)} label="Pi Wallet" />
          <TrustBadge active={Boolean(profile.iban)} label="IBAN" />
          <TrustBadge active={approvedDocs.length > 0} label="Belge" />
        </div>
      </div>

      <ProviderReviewSummary t={t} rating={providerRating} reviews={reviews} />

      <div className="rounded-[30px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] border border-[#EAECF0] space-y-3">
        <h3 className="text-xl font-black text-[#101828]">Hizmet Veren Kaydı</h3>
        <Input label={t.name} value={profile.fullName} onChange={(v: string) => updateProfile('fullName', v)} />
        <Input label={t.phone} value={profile.phone} onChange={(v: string) => updateProfile('phone', v)} />
        <Input label={t.company} value={profile.company} onChange={(v: string) => updateProfile('company', v)} />
        <Input label="Meslek / Uzmanlık" value={profile.profession} onChange={(v: string) => updateProfile('profession', v)} />
        <Input label={t.experience} value={profile.experience} onChange={(v: string) => updateProfile('experience', v)} />
        <Input label={t.certificate} value={profile.certificates} onChange={(v: string) => updateProfile('certificates', v)} />
        <div className="rounded-2xl bg-[#F8FAFC] border border-gray-100 p-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF8F0] text-[#27C267] flex items-center justify-center shrink-0">
              <Upload size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-[#111]">Sertifika / Belge Dosyası</p>
              <p className="text-sm text-[#667085] mt-1">Diploma, ustalık belgesi, sertifika veya izin belgesini galeriden seçebilirsin.</p>
              {profile.certificates && <p className="text-xs text-[#15803D] font-black mt-2 truncate">Seçili belge: {profile.certificates}</p>}
            </div>
          </div>
          <label className="mt-3 block w-full py-3 rounded-2xl bg-[#27C267] text-white text-center font-black cursor-pointer shadow-sm">
            Galeriden Sertifika / Belge Seç
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  updateProfile('certificates', file.name);
                  submitDocument(file, 'Sertifika / Belge', profile.profession || 'Hizmet Veren Profili');
                }
              }}
            />
          </label>
        </div>
        <button onClick={saveProfile} className="w-full py-4 rounded-2xl bg-[#27C267] text-white font-black">Profili Kaydet</button>
      </div>

      <div className="rounded-[30px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] border border-[#EAECF0]">
        <h3 className="text-xl font-black text-[#101828] mb-3">{t.myServices}</h3>
        <div className="grid grid-cols-2 gap-3">
          {allServices.map((s) => {
            const value = `${s.sector} / ${s.title}`;
            const active = profile.services.includes(value);
            return (
              <button key={s.id} onClick={() => updateProfile('services', active ? profile.services.filter((x: string) => x !== value) : [...profile.services, value])} className={`rounded-2xl p-3 text-left border ${active ? 'bg-[#EAF8F0] border-[#27C267]' : 'bg-[#F8FAFC] border-transparent'}`}>
                <div className="text-3xl">{s.icon}</div><b className="block mt-2">{s.title}</b><p className="text-xs text-[#667085]">{s.sector}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProviderJobs({ t, requests, onOffer }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-[28px] leading-tight font-black text-[#101828]">{t.openJobs}</h2>
      <p className="text-[#667085]">{requests.length} açık talep</p>
      {requests.map((r: RequestItem) => (
        <div key={r.id} className="rounded-[30px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] border border-[#EAECF0]">
          <h3 className="text-xl font-black text-[#101828]">{r.title}</h3>
          <p className="text-[#667085]">{r.location} • {r.date}</p>
          <p className="mt-2">{r.description}</p>
          <div className="mt-3 flex justify-between"><b className="text-[#27C267]">{r.budget}</b><span className="text-sm">{r.status}</span></div>
          <button onClick={() => onOffer(r)} className="w-full mt-4 py-3 rounded-2xl bg-[#27C267] text-white font-black">{t.createOffer}</button>
        </div>
      ))}
    </div>
  );
}

function ProviderOffers({ t, offers, jobs, messages, escrows, updateEscrowStatus, messageDrafts, setMessageDrafts, sendMessage, completeJob }: any) {
  return (
    <div className="space-y-5">
      <h2 className="text-[28px] leading-tight font-black text-[#101828]">{t.myOffers}</h2>

      <ActiveJobsPanel
        t={t}
        jobs={jobs}
        messages={messages}
        escrows={escrows}
        updateEscrowStatus={updateEscrowStatus}
        messageDrafts={messageDrafts}
        setMessageDrafts={setMessageDrafts}
        sendMessage={sendMessage}
        completeJob={completeJob}
        mode="provider"
      />

      {offers.length === 0 ? <EmptyState title="Henüz teklif yok" text="Açık işlerden teklif gönder." /> : offers.map((o: OfferItem) => (
        <div key={o.id} className="rounded-[30px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] border border-[#EAECF0]">
          <h3 className="text-xl font-black text-[#101828]">{o.requestTitle}</h3>
          <p className="text-[#667085]">{o.price} • {o.feePaid}</p>
          <p>{o.message}</p>
          <span className="inline-block mt-3 text-sm bg-[#EAF8F0] text-[#27C267] rounded-full px-3 py-1">{o.status}</span>
        </div>
      ))}
    </div>
  );
}

function ActiveJobsPanel({ t, jobs, messages, reviews, escrows, updateEscrowStatus, messageDrafts, setMessageDrafts, sendMessage, completeJob, onReview, mode }: any) {
  const visibleJobs = jobs || [];

  if (!visibleJobs.length) {
    return (
      <div className="rounded-[30px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] border border-[#EAECF0] border border-gray-100">
        <h3 className="text-[24px] leading-tight font-black text-[#101828]">{t.activeJobs}</h3>
        <p className="text-[#667085] mt-1">Teklif seçilince iş akışı ve mesajlaşma burada görünür.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-[24px] leading-tight font-black text-[#101828]">{t.activeJobs}</h3>
      {visibleJobs.map((job: JobItem) => {
        const jobMessages = messages.filter((m: MessageItem) => m.jobId === job.id);
        const alreadyReviewed = Array.isArray(reviews) && reviews.some((r: ReviewItem) => String(r.jobId) === String(job.id));
        return (
          <div key={job.id} className="rounded-[30px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] border border-[#EAECF0] border border-[#EAF8F0]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xl font-black text-[#101828]">{job.title}</h4>
                <p className="text-[#667085]">{job.company} • {job.price}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-black ${job.status === 'completed' ? 'bg-gray-200 text-gray-700' : 'bg-[#EAF8F0] text-[#27C267]'}`}>
                {job.status === 'completed' ? 'Tamamlandı' : 'İş başladı'}
              </span>
            </div>

            <EscrowMiniPanel job={job} escrows={escrows || []} mode={mode} updateEscrowStatus={updateEscrowStatus} />

            <div className="mt-4 rounded-2xl bg-[#F8FAFC] p-3 space-y-2">
              <p className="font-black">{t.messages}</p>
              {jobMessages.length === 0 ? (
                <p className="text-sm text-[#667085]">Henüz mesaj yok.</p>
              ) : (
                jobMessages.slice(-4).map((m: MessageItem) => (
                  <div key={m.id} className={`rounded-2xl p-3 text-sm ${m.senderKey.includes(mode === 'provider' ? 'provider' : 'buyer') ? 'bg-[#27C267] text-white ml-8' : 'bg-white text-[#111] mr-8'}`}>
                    {m.message}
                  </div>
                ))
              )}

              <div className="flex gap-2 pt-2">
                <input
                  value={messageDrafts[job.id] || ''}
                  onChange={(e) => setMessageDrafts((prev: any) => ({ ...prev, [job.id]: e.target.value }))}
                  placeholder="Mesaj yaz..."
                  className="flex-1 rounded-2xl bg-white px-4 py-3 outline-none"
                />
                <button onClick={() => sendMessage(job.id)} className="px-4 rounded-2xl bg-[#27C267] text-white font-black">
                  Gönder
                </button>
              </div>
            </div>

            {job.status !== 'completed' && (
              <button onClick={() => completeJob(job.id)} className="w-full mt-4 py-3 rounded-2xl bg-[#111] text-white font-black">
                {t.completeJob}
              </button>
            )}

            {job.status === 'completed' && mode === 'buyer' && (
              alreadyReviewed ? (
                <div className="w-full mt-4 py-3 rounded-2xl bg-[#EAF8F0] text-[#15803D] text-center font-black">
                  Yorum ve değerlendirme kaydedildi
                </div>
              ) : (
                <button onClick={() => onReview && onReview(job)} className="w-full mt-4 py-3 rounded-2xl bg-[#27C267] text-white font-black">
                  ⭐ {t.reviewJob}
                </button>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}



function escrowLabel(status: EscrowStatus) {
  const map: Record<EscrowStatus, string> = {
    pending_funding: 'Fon bekleniyor',
    funded: 'Güvenli havuzda',
    provider_assigned: 'Hizmet veren atandı',
    work_started: 'İş başladı',
    work_completed: 'İş tamamlandı',
    customer_approved: 'Müşteri onayladı',
    released: 'Ödeme serbest',
    disputed: 'Sorun bildirildi',
    refunded: 'İade edildi',
  };
  return map[status] || status;
}

function EscrowMiniPanel({ job, escrows, mode, updateEscrowStatus }: any) {
  const escrow: EscrowItem | undefined = (escrows || []).find((e: EscrowItem) => e.jobId === job.id || e.offerId === job.offerId);
  const status: EscrowStatus = escrow?.status || 'pending_funding';
  const isBuyer = mode === 'buyer';
  return (
    <div className="mt-4 rounded-2xl bg-[#0F172A] text-white p-4 border border-[#1F2937]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-[#00FFAA] font-black">Wanted Escrow</p>
          <h4 className="text-lg font-black">{escrowLabel(status)}</h4>
          <p className="text-xs text-gray-300 mt-1">Tutar: {escrow?.amount || job.price || '-'} • Demo güvenli ödeme</p>
        </div>
        <Wallet className="text-[#00FFAA]" />
      </div>

      {mode === 'provider' && ['funded', 'work_started', 'work_completed'].includes(status) && (
        <div className="mt-3 rounded-xl bg-[#00FFAA]/10 border border-[#00FFAA]/30 p-3 text-sm font-bold text-[#B6FFE4]">
          Bu işin ödemesi güvenli havuzda tutuluyor.
        </div>
      )}

      {isBuyer && status === 'pending_funding' && (
        <button onClick={() => updateEscrowStatus && updateEscrowStatus(job.id, 'funded')} className="w-full mt-3 py-3 rounded-2xl bg-[#27C267] text-white font-black">
          Güvenli Ödeme Başlat
        </button>
      )}
      {isBuyer && job.status === 'completed' && status === 'funded' && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button onClick={() => updateEscrowStatus && updateEscrowStatus(job.id, 'released')} className="py-3 rounded-2xl bg-[#27C267] text-white font-black">
            Ödemeyi Serbest Bırak
          </button>
          <button onClick={() => updateEscrowStatus && updateEscrowStatus(job.id, 'disputed', 'Müşteri sorun bildirdi')} className="py-3 rounded-2xl bg-red-500 text-white font-black">
            Sorun Bildir
          </button>
        </div>
      )}
    </div>
  );
}

function BuyerSettingsPage({ t, profile, setPage, setRole }: any) {
  const menu = [
    { title: t.myProfile, desc: 'Profil resmini, adını, telefonunu ve konumunu düzenle.', icon: '👤', tone: '#8B5CF6', action: () => setPage('profile') },
    { title: 'Şifreler', desc: 'Şifre ve güvenlik tercihlerini yönet.', icon: '🔐', tone: '#7C3AED', action: () => alert('Şifreler demo alanı') },
    { title: 'Ödemeler', desc: 'Pi Wallet, IBAN ve ödeme tercihlerini yönet.', icon: '💳', tone: '#F59E0B', action: () => setPage('profile') },
    { title: t.inviteFriend, desc: 'Pi Browser, Telegram veya WhatsApp ile davet mesajını paylaş.', icon: '🔗', tone: '#06B6D4', action: shareWantedApp },
    { title: t.rateApp, desc: 'Uygulama deneyimini değerlendir.', icon: '⭐', tone: '#EC4899', action: () => alert('Uygulamayı değerlendir demo') },
    { title: 'Wanted ulaş', desc: 'Destek, iletişim ve geri bildirim alanı.', icon: '✉️', tone: '#3B82F6', action: () => alert('Wanted ulaş alanı sonraki güncellemede aktif edilecek.') },
    { title: 'Wanted sor', desc: 'Wanted yardımcı ve sık sorulan sorular.', icon: '❓', tone: '#F97316', action: () => alert('Wanted sor alanı sonraki güncellemede aktif edilecek.') },
    { title: 'Reklam ver', desc: 'Hizmetini daha çok kişiye ulaştır.', icon: '📣', tone: '#F43F5E', action: () => alert('Reklam ver alanı sonraki güncellemede aktif edilecek.') },
  ];

  return (
    <div className="space-y-6">
      <div className="pt-2 flex items-center justify-between">
        <div>
          <p className="text-[#667085]">Merhaba,</p>
          <h2 className="text-[28px] leading-tight font-black text-[#101828]">{profile.fullName || 'Hizmet Alan'}</h2>
        </div>
        <div className="w-20 h-20 rounded-full bg-[#EAF8F0] flex items-center justify-center text-4xl text-[#27C267] shadow-sm">
          W
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-[#EAF8F0]">
        <div className="whitespace-nowrap py-2 text-sm font-black text-[#15803D] animate-[buyerTicker_3s_ease-out_forwards]">
          ✦ Güvenli hizmet bul ✦ Teklifleri karşılaştır ✦ Doğrulanmış uzmanlar ✦ Wanted güvencesi ✦ Şeffaf talep sistemi ✦ Güvenli hizmet bul ✦ Teklifleri karşılaştır ✦ Doğrulanmış uzmanlar ✦
        </div>
        <style>{`
          @keyframes buyerTicker {
            0% { transform: translateX(-55%); }
            100% { transform: translateX(0); }
          }
        `}</style>
      </div>

      <div className="rounded-[34px] bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#042F2E] p-4 shadow-[0_24px_70px_rgba(15,23,42,0.28)] border border-white/10 space-y-3">
        {menu.map((item, idx) => (
          <button
            key={item.title}
            onClick={item.action}
            className="w-full p-4 text-left flex items-center gap-3 rounded-[24px] bg-white/10 border border-white/10 hover:bg-white/15 transition-all animate-[buyerSlide_.35s_ease_forwards] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]"
            style={{ animationDelay: `${idx * 35}ms` }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl text-white shadow-[0_0_24px_rgba(255,255,255,0.18)]" style={{ background: item.tone }}>{item.icon}</div>
            <div className="flex-1">
              <h3 className="font-black text-lg text-white">{item.title}</h3>
              <p className="text-sm text-white/65">{item.desc}</p>
            </div>
            <ChevronRight className="text-white/70" />
          </button>
        ))}
      </div>

      <button onClick={() => setRole(null)} className="w-full py-4 rounded-2xl bg-[#111] text-white font-black">
        {t.logout}
      </button>

      <p className="text-center text-[#667085] text-sm pb-4">{t.version}</p>

      <style>{`
        @keyframes buyerSlide {
          from { opacity: 0; transform: translateX(-18px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}


function ProviderSettingsPage({ t, profile, setPage, setRole }: any) {
  const menu = [
    { title: 'Profilim', desc: 'Ad, telefon, firma ve uzmanlık bilgilerini düzenle.', icon: '👤', tone: '#8B5CF6', action: () => setPage('profile') },
    { title: 'Hizmet ekle', desc: 'Yeni meslek/branş ekle, belge yükle ve aktif et.', icon: '➕', tone: '#22C55E', action: () => setPage('serviceAdd') },
    { title: 'Hizmetlerim', desc: 'Aktif hizmetlerini ve belge durumlarını görüntüle.', icon: '💼', tone: '#10B981', action: () => setPage('serviceAdd') },
    { title: 'Ödemeler', desc: 'Pi Wallet, IBAN ve ödeme alma tercihleri.', icon: '💳', tone: '#F59E0B', action: () => setPage('profile') },
    { title: 'Şifreler', desc: 'Şifre, bildirim ve güvenlik tercihleri.', icon: '🔐', tone: '#7C3AED', action: () => alert('Şifreler demo alanı') },
    { title: 'Müşteri yorumları', desc: 'Müşterilerin senin hakkında yazdıkları.', icon: '⭐', tone: '#EC4899', action: () => alert('Müşteri yorumları demo alanı') },
    { title: 'Pazarlama profilim', desc: 'Rozet, öne çıkarma ve profesyonel görünürlük.', icon: '🚀', tone: '#F97316', action: () => alert('Pazarlama profili demo alanı') },
    { title: 'Arkadaşına tavsiye et', desc: 'Pi Browser, Telegram veya WhatsApp ile davet mesajını paylaş.', icon: '🔗', tone: '#06B6D4', action: shareWantedApp },
    { title: 'Wanted ulaş', desc: 'Wanted ekibinden destek al.', icon: '✉️', tone: '#3B82F6', action: () => alert('Wanted ulaş demo alanı') },
    { title: 'Wanted sor', desc: 'Yardımcı ve sık sorulan sorular.', icon: '❓', tone: '#F43F5E', action: () => alert('Wanted sor demo alanı') },
  ];

  return (
    <div className="space-y-6 pb-28">
      <div className="rounded-[32px] bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#064E3B] p-5 text-white shadow-lg border border-[#1F2937]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#00FFAA] text-lg">Merhaba,</p>
            <h2 className="text-4xl font-black">{profile.fullName || 'Hizmet Veren'}</h2>
            <p className="text-gray-300 mt-1">{profile.company || 'Firma / şahıs kaydı'}</p>
          </div>
          <div className="w-20 h-20 rounded-full bg-[#00FFAA]/15 border border-[#00FFAA]/40 flex items-center justify-center text-4xl text-[#00FFAA] font-black">
            W
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-[#111827] border border-[#1F2937] shadow-sm">
        <div className="whitespace-nowrap py-3 text-sm font-black text-[#00FFAA] animate-[providerTicker_3s_ease-out_forwards]">
          ✦ İş fırsatlarını yakala ✦ Belgeli uzman olarak öne çık ✦ 0.314 Pi teklif sistemi ✦ Güvenli müşteri eşleşmesi ✦
        </div>
        <style>{`
          @keyframes providerTicker {
            0% { transform: translateX(-55%); }
            100% { transform: translateX(0); }
          }
        `}</style>
      </div>

      <div className="rounded-[34px] bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#042F2E] p-4 shadow-[0_24px_70px_rgba(15,23,42,0.28)] border border-white/10 space-y-3">
        {menu.map((item, idx) => (
          <button
            key={item.title}
            onClick={item.action}
            className="w-full p-4 text-left flex items-center gap-3 rounded-[24px] bg-white/10 border border-white/10 hover:bg-white/15 transition-all animate-[providerSlide_.35s_ease_forwards] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]"
            style={{ animationDelay: `${idx * 45}ms` }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl text-white shadow-[0_0_24px_rgba(255,255,255,0.18)]" style={{ background: item.tone }}>
              {item.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-black text-xl text-white">{item.title}</h3>
              <p className="text-sm text-white/65 mt-1">{item.desc}</p>
            </div>
            <ChevronRight className="text-white/70" />
          </button>
        ))}
      </div>

      <button onClick={() => setRole(null)} className="w-full py-4 rounded-2xl bg-[#111] text-white font-black">
        Çıkış
      </button>

      <p className="text-center text-[#667085] text-sm pb-4">{t.version}</p>

      <style>{`
        @keyframes providerSlide {
          from { opacity: 0; transform: translateX(-18px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function ServiceAddPage({ t, profile, documents, updateProfile, showToast, submitDocument }: any) {
  const [q, setQ] = useState('');
  const [selectedCerts, setSelectedCerts] = useState<any>({});
  const approvedDocs = documents?.filter((d: DocumentItem) => d.status === 'approved') || [];
  const pendingDocs = documents?.filter((d: DocumentItem) => d.status === 'pending') || [];
  const services = allServices.filter((s) => `${s.title} ${s.sector}`.toLowerCase().includes(q.toLowerCase()));

  function needsCertificate(title: string) {
    return ['Hemşire', 'Doktor', 'Fizyoterapist', 'Psikolog', 'Diyetisyen', 'Hasta Bakıcı', 'Elektrikçi'].some((x) => title.includes(x));
  }

  function uploadedFor(serviceId: string) {
    return Boolean(selectedCerts[serviceId] || profile.certificates || approvedDocs.length);
  }

  function toggleService(s: Service) {
    const value = `${s.sector} / ${s.title}`;
    const active = profile.services.includes(value);

    if (!active && needsCertificate(s.title) && !uploadedFor(s.id)) {
      alert('Bu hizmet için sertifika/diploma/ustalık belgesi yüklenmeden hizmet aktif edilemez.');
      return;
    }

    updateProfile('services', active ? profile.services.filter((x: string) => x !== value) : [...profile.services, value]);
    showToast(active ? 'Hizmet kaldırıldı' : 'Hizmet eklendi');
  }

  return (
    <div className="space-y-5 pb-28">
      <div className="rounded-[32px] bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#064E3B] p-5 text-white shadow-lg">
        <h2 className="text-[28px] leading-tight font-black text-[#101828]">Hizmet Ekle</h2>
        <p className="text-gray-300 mt-2">Her meslek için hizmet profili oluştur. Belge isteyen işlerde galeriden sertifika/diploma yükle.</p>
      </div>

      <div className="grid grid-cols-2 gap-3"><MiniStat icon={<ShieldCheck />} label={`${approvedDocs.length} Onaylı`} /><MiniStat icon={<Upload />} label={`${pendingDocs.length} Bekleyen`} /></div>

      <Input label="Meslek veya hizmet ara..." value={q} onChange={setQ} />

      <div className="space-y-3">
        {services.map((s) => {
          const value = `${s.sector} / ${s.title}`;
          const active = profile.services.includes(value);
          const cert = needsCertificate(s.title);
          const hasCert = uploadedFor(s.id);

          return (
            <div key={s.id} className={`rounded-3xl p-4 border bg-white shadow-sm ${active ? 'border-[#27C267]' : 'border-gray-100'}`}>
              <div className="flex gap-3 items-center">
                <div className="text-4xl">{s.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-black">{s.title}</h3>
                  <p className="text-sm text-[#667085]">{s.sector}</p>
                  {cert && <p className="text-xs text-[#FF7A00] mt-1">Belge / diploma / sertifika istenir</p>}
                  {hasCert && <p className="text-xs text-[#27C267] mt-1">Belge seçildi: {selectedCerts[s.id] || 'Profil belgesi'}</p>}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${active ? 'bg-[#27C267] text-white' : cert ? 'bg-[#FFF4EA] text-[#FF7A00]' : 'bg-gray-100 text-[#475467]'}`}>
                  {active ? 'Aktif' : cert ? 'Belge gerekli' : 'Ekle'}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                <label className="w-full py-3 rounded-2xl bg-[#F8FAFC] border border-gray-100 text-center font-black cursor-pointer">
                  Galeriden Seç / Belge Yükle
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedCerts((prev: any) => ({ ...prev, [s.id]: file.name }));
                        submitDocument(file, cert ? 'Sertifika / Diploma / Ustalık Belgesi' : 'Hizmet Belgesi', s.title);
                      }
                    }}
                  />
                </label>

                <button
                  onClick={() => toggleService(s)}
                  className={`w-full py-3 rounded-2xl font-black ${active ? 'bg-gray-200 text-[#111]' : 'bg-[#27C267] text-white'}`}
                >
                  {active ? 'Hizmeti Kaldır' : 'Hizmeti Aktif Et'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfilePage({ t, role, profile, updateProfile, saveProfile }: any) {
  return (
    <div className="space-y-5">
      <h2 className="text-[28px] leading-tight font-black text-[#101828]">{t.profile}</h2>
      <div className="rounded-[30px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] border border-[#EAECF0] space-y-3">
        <Input label={t.name} value={profile.fullName} onChange={(v: string) => updateProfile('fullName', v)} />
        <Input label={t.phone} value={profile.phone} onChange={(v: string) => updateProfile('phone', v)} />
        <Input label={t.location} value={profile.location} onChange={(v: string) => updateProfile('location', v)} />
        <Input label="TC Kimlik No" value={profile.tcNo} onChange={(v: string) => updateProfile('tcNo', v)} />
        <Input label="Pi Wallet" value={profile.piWallet} onChange={(v: string) => updateProfile('piWallet', v)} />
        <Input label="IBAN" value={profile.iban} onChange={(v: string) => updateProfile('iban', v)} />
        <button onClick={saveProfile} className="w-full py-4 rounded-2xl bg-[#27C267] text-white font-black">{t.save}</button>
      </div>
    </div>
  );
}


function ReviewForm({ t, job, onSave }: any) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-[#27C267] font-black">Tamamlanan iş</p>
        <h2 className="text-[24px] leading-tight font-black text-[#101828]">{job.title}</h2>
        <p className="text-[#667085]">{job.company} • {job.price}</p>
      </div>

      <div className="rounded-3xl bg-[#F8FAFC] p-4">
        <p className="font-black mb-3">Hizmeti değerlendir</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setStars(n)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${n <= stars ? 'bg-[#27C267] text-white' : 'bg-white text-gray-400'}`}
            >
              <Star size={24} fill={n <= stars ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Hizmet kalitesi, iletişim, zamanlama ve memnuniyetini yaz..."
        className="w-full rounded-2xl bg-[#F1F3F5] p-4 outline-none min-h-28"
      />

      <button
        onClick={() => onSave(stars, comment || 'Hizmet tamamlandı, değerlendirme yapıldı.')}
        className="w-full py-4 rounded-2xl bg-[#27C267] text-white font-black text-lg"
      >
        Yorumu Kaydet
      </button>
    </div>
  );
}

function ProviderReviewSummary({ t, rating, reviews }: any) {
  const latest = (rating?.reviews || reviews || []).slice(0, 3);
  return (
    <div className="rounded-[30px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] border border-[#EAECF0] border border-[#EAF8F0]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-[#101828]">{t.providerRating}</h3>
          <p className="text-[#667085]">Müşteri yorumları ve güven puanı</p>
        </div>
        <div className="text-right">
          <div className="text-[28px] leading-tight font-black text-[#101828] text-[#27C267]">⭐ {rating?.count ? rating.avg : '-'}</div>
          <p className="text-xs text-[#667085]">{rating?.count || 0} değerlendirme</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {latest.length === 0 ? (
          <p className="text-sm text-[#667085]">İş tamamlandığında yorum ve puanlar burada görünür.</p>
        ) : latest.map((r: ReviewItem) => (
          <div key={r.id} className="rounded-2xl bg-[#F8FAFC] p-3">
            <div className="flex items-center justify-between">
              <b>{r.jobTitle || 'Tamamlanan iş'}</b>
              <span className="text-[#27C267] font-black">⭐ {r.stars}</span>
            </div>
            <p className="text-sm text-[#475467] mt-1">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminHome({ t, requests, offers, documents, reviews, setDocumentStatus, profile, setRole }: any) {
  const pending = documents.filter((d: DocumentItem) => d.status === 'pending');
  const approved = documents.filter((d: DocumentItem) => d.status === 'approved');

  return (
    <div className="space-y-5">
      <h2 className="text-[28px] leading-tight font-black text-[#101828]">{t.adminPanel}</h2>
      <div className="grid grid-cols-2 gap-3">
        <AdminStat title="Demo Talep" value={requests.length} />
        <AdminStat title="Teklif" value={offers.length} />
        <AdminStat title="Bekleyen Belge" value={pending.length} />
        <AdminStat title="Onaylı Uzman" value={approved.length} />
        <AdminStat title="Yorum" value={reviews.length} />
      </div>

      <div className="rounded-[30px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] border border-[#EAECF0] space-y-3">
        <h3 className="text-[24px] leading-tight font-black text-[#101828]">Belge Onay Paneli</h3>
        {documents.length === 0 ? (
          <p className="text-[#667085]">Henüz belge yüklenmedi.</p>
        ) : documents.map((doc: DocumentItem) => (
          <div key={doc.id} className="rounded-2xl bg-[#F8FAFC] p-4 border border-gray-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-black text-lg">{doc.fullName || 'Hizmet Veren'}</h4>
                <p className="text-sm text-[#667085]">{doc.company || '-'} • {doc.profession || '-'}</p>
                <p className="text-sm mt-1">{doc.documentType}</p>
                <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-[#27C267] text-sm font-black underline">Belgeyi aç</a>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-black ${doc.status === 'approved' ? 'bg-[#EAF8F0] text-[#15803D]' : doc.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-[#FFF4EA] text-[#FF7A00]'}`}>
                {doc.status === 'approved' ? 'Onaylı' : doc.status === 'rejected' ? 'Reddedildi' : 'Bekliyor'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button onClick={() => setDocumentStatus(doc.id, 'approved')} className="py-3 rounded-2xl bg-[#27C267] text-white font-black">Onayla</button>
              <button onClick={() => setDocumentStatus(doc.id, 'rejected')} className="py-3 rounded-2xl bg-gray-200 text-[#111] font-black">Reddet</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setRole(null)} className="w-full py-4 rounded-2xl bg-[#111] text-white font-black">Admin Çıkış</button>
    </div>
  );
}

function Notifications() {
  return <div className="space-y-4"><h2 className="text-[28px] leading-tight font-black text-[#101828]">Bildirimler</h2><EmptyState title="Henüz bildirim yok" text="Talep ve teklif hareketleri burada görünecek." /></div>;
}

function BottomNav({ role, page, setPage, t }: any) {
  const items = role === 'buyer'
    ? [
        { key: 'neoHome', label: t.buyer, icon: Search },
        { key: 'jobs', label: t.jobs, icon: Briefcase },
        { key: 'offers', label: t.offers, icon: FileText },
        { key: 'settings', label: 'Ayarlar', icon: User },
      ]
    : [
        { key: 'providerHome', label: 'Panel', icon: Search },
        { key: 'jobs', label: t.openJobs, icon: Briefcase },
        { key: 'offers', label: t.offers, icon: FileText },
        { key: 'settings', label: 'Ayarlar', icon: User },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pointer-events-none">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1 rounded-[28px] bg-[#0F172A]/92 backdrop-blur-xl border border-white/10 shadow-[0_18px_45px_rgba(15,23,42,0.35)] p-2 pointer-events-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active = page === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className={`py-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all ${active ? 'bg-[#27C267] text-white shadow-[0_0_18px_rgba(39,194,103,0.45)]' : 'text-white/55 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon size={22} strokeWidth={active ? 2.8 : 2.2} />
              <span className="text-[11px] font-black leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}


function PremiumSplashHero({ t }: any) {
  const slides = [
    { icon: '🟢', title: 'Güvenli hizmet bul', desc: 'Aradığın hizmeti hızlıca seç, talebini oluştur.' },
    { icon: '💼', title: 'Belgeli uzmanlarla çalış', desc: 'Hizmet verenler branş ve belgeye göre ayrılır.' },
    { icon: '⚡', title: 'Teklifleri karşılaştır', desc: 'Gelen teklifleri fiyat, deneyim ve açıklamaya göre seç.' },
    { icon: '💎', title: 'Wanted.pi premium pazar', desc: 'Web3 hazır, Pi destekli hizmet pazarı deneyimi.' },
  ];

  return (
    <div className="text-center mb-6 relative overflow-hidden rounded-[32px] bg-gradient-to-br from-white via-[#F8FFFB] to-[#F5FAF7] p-5 shadow-[0_22px_60px_rgba(15,23,42,0.10)] border border-white">
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#27C267]/12 blur-3xl pointer-events-none" />

      <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#052E1F] via-[#075C3A] to-[#0AA765] shadow-[0_0_55px_rgba(39,194,103,0.36)] animate-[heroPulse_3s_ease-in-out_infinite]" />
        <div className="absolute inset-[10px] rounded-full border-[5px] border-[#F4D06F]/85 shadow-[inset_0_0_20px_rgba(255,255,255,0.18)]" />
        <div className="absolute inset-[-8px] rounded-full border-2 border-[#27C267]/45 animate-[orbitSpin_7s_linear_infinite]" />
        <div className="absolute inset-[-22px] rounded-full border border-[#F4D06F]/35 animate-[orbitReverse_10s_linear_infinite]" />
        <div className="absolute inset-[-30px] rounded-full border-[3px] animate-[orbitReverse_5.8s_linear_infinite]" style={{ borderColor: '#EF4444 transparent #F59E0B #EF4444' }} />
        <div className="absolute w-[118%] h-8 rounded-full border border-[#8CFFBF]/60 rotate-[-10deg] shadow-[0_0_18px_rgba(39,194,103,0.45)] animate-[orbitSpin_9s_linear_infinite]" />
        <div className="absolute w-5 h-5 rounded-full bg-white shadow-[0_0_18px_rgba(39,194,103,0.9)] left-2 top-[52%]" />
        <div className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_18px_rgba(39,194,103,0.9)] right-5 top-[56%]" />
        <span className="relative text-[76px] leading-none font-black text-white drop-shadow-[0_6px_8px_rgba(0,0,0,0.32)] animate-[wRotate_8s_linear_infinite]">
          W
        </span>
      </div>

      <div className="mt-5 flex items-center justify-center gap-1">
        <h1 className="text-5xl font-black tracking-tight text-[#0B1F17]">Wanted</h1>
        <span className="text-5xl font-black text-[#16A34A]">.pi</span>
      </div>

      <div className="h-8 mt-3 overflow-hidden flex justify-center">
        <p className="text-xl font-black text-[#101828] text-[#16A34A] animate-[typeOnce_2.8s_steps(28)_forwards] whitespace-nowrap border-r-2 border-[#16A34A]">
          Arayan bulur, çalışan kazanır.
        </p>
      </div>

      <div className="relative mt-5 h-[86px] overflow-hidden rounded-[24px] bg-white/85 border border-[#EAECF0] shadow-sm">
        <div className="absolute inset-0 animate-[slideDeck_16s_ease-in-out_infinite]">
          {slides.map((s, i) => (
            <div key={i} className="h-[86px] flex items-center gap-3 px-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF8F0] flex items-center justify-center text-2xl">
                {s.icon}
              </div>
              <div>
                <h3 className="text-lg font-black text-[#111]">{s.title}</h3>
                <p className="text-sm text-[#667085]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes wRotate {
          0% { transform: rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateY(360deg) rotateZ(360deg); }
        }
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbitReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes heroPulse {
          0%, 100% { filter: brightness(1); transform: scale(1); }
          50% { filter: brightness(1.18); transform: scale(1.025); }
        }
        @keyframes typeOnce {
          from { width: 0; opacity: 1; }
          to { width: 285px; opacity: 1; }
        }
        @keyframes slideDeck {
          0%, 18% { transform: translateY(0); }
          25%, 43% { transform: translateY(-86px); }
          50%, 68% { transform: translateY(-172px); }
          75%, 93% { transform: translateY(-258px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}


function RoleCard({ icon, title, desc, color, onClick }: any) {
  const tone = color === 'green'
    ? 'from-[#ECFDF3] to-white border-[#B7EACB] text-[#0B5E37]'
    : color === 'orange'
      ? 'from-[#FFF7ED] to-white border-[#FED7AA] text-[#C2410C]'
      : 'from-white to-[#F8FAFC] border-[#EAECF0] text-[#101828]';
  return (
    <button
      onClick={onClick}
      className={`w-full mb-4 rounded-[30px] border bg-gradient-to-br ${tone} p-5 text-left flex items-center gap-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] active:scale-[0.99] transition-all hover:-translate-y-0.5`}
    >
      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm text-[#12864F]">{icon}</div>
      <div className="flex-1">
        <h3 className="text-[22px] leading-tight font-black text-[#101828]">{title}</h3>
        <p className="text-sm text-[#667085] mt-1 leading-snug">{desc}</p>
      </div>
      <div className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center text-[#475467]"><ChevronRight size={20} /></div>
    </button>
  );
}

function Input({ label, value, onChange }: any) {
  return <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={label} className="w-full rounded-2xl bg-white border border-[#EAECF0] px-4 py-4 outline-none text-base shadow-sm focus:border-[#27C267] focus:ring-4 focus:ring-[#27C267]/10 transition-all" />;
}

function BottomSheet({ children, onClose }: any) {
  return <div onClick={onClose} className="fixed inset-0 bg-[#101828]/55 backdrop-blur-sm z-50 flex items-end"><div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md mx-auto rounded-t-[34px] bg-white p-6 pb-12 max-h-[88vh] overflow-y-auto shadow-[0_-22px_60px_rgba(15,23,42,0.24)]"><button onClick={onClose} className="absolute right-5 top-5 w-10 h-10 rounded-full bg-[#F2F4F7] flex items-center justify-center"><X size={20} /></button>{children}</div></div>;
}

function EmptyState({ title, text }: any) {
  return <div className="rounded-[30px] bg-white p-8 text-center shadow-[0_14px_40px_rgba(15,23,42,0.06)] border border-[#EAECF0]"><div className="w-16 h-16 mx-auto rounded-2xl bg-[#EAF8F0] flex items-center justify-center text-[#27C267] mb-4"><FileText /></div><h3 className="text-xl font-black text-[#101828] text-[#101828]">{title}</h3><p className="text-[#667085] mt-2 text-sm leading-relaxed">{text}</p></div>;
}

function MiniStat({ icon, label }: any) {
  return <div className="rounded-2xl bg-white border border-[#EAECF0] p-3 text-center shadow-sm"><div className="text-[#27C267] flex justify-center mb-1">{icon}</div><b className="text-sm text-[#101828]">{label}</b></div>;
}

function AdminStat({ title, value }: any) {
  return <div className="rounded-[28px] bg-white border border-[#EAECF0] p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)]"><p className="text-[#667085] text-sm font-semibold">{title}</p><b className="text-3xl text-[#101828]">{value}</b></div>;
}

function Toast({ message }: any) {
  return <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-[#101828] text-white px-5 py-3 rounded-2xl font-black shadow-[0_18px_45px_rgba(15,23,42,0.25)] border border-white/10">{message}</div>;
}
