"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Currency = {
    code: string;
    symbol: string;
    rate: number; // Rate relative to USD (1 USD = X Currency)
    flag: string;
};

export type Language = {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
};

const LANGUAGES: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
];

const INITIAL_CURRENCIES: Currency[] = [
    { code: 'USD', symbol: '$', rate: 1, flag: '🇺🇸' },
    { code: 'JPY', symbol: '¥', rate: 156.45, flag: '🇯🇵' },
    { code: 'PKR', symbol: 'Rs', rate: 278.50, flag: '🇵🇰' },
    { code: 'CAD', symbol: 'C$', rate: 1.36, flag: '🇨🇦' },
    { code: 'AUD', symbol: 'A$', rate: 1.51, flag: '🇦🇺' },
    { code: 'GBP', symbol: '£', rate: 0.78, flag: '🇬🇧' },
    { code: 'EUR', symbol: '€', rate: 0.92, flag: '🇪🇺' },
    { code: 'NZD', symbol: 'NZ$', rate: 1.63, flag: '🇳🇿' },
    { code: 'AED', symbol: 'DH', rate: 3.67, flag: '🇦🇪' },
    { code: 'TZS', symbol: 'TSh', rate: 2600, flag: '🇹🇿' },
];

interface CurrencyContextType {
    selectedCurrency: Currency;
    setCurrency: (code: string) => void;
    selectedLanguage: Language;
    setLanguage: (code: string) => void;
    currencies: Currency[];
    languages: Language[];
    convertPrice: (price: number, fromCurrency?: string) => string;
    formatPrice: (price: number, code?: string) => string;
    t: (key: string) => string;
    lastUpdated: string;
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
    en: {
        search_anything: "Search Anything",
        search_placeholder: "Make, model, year or stock ID...",
        all_brands: "All Brands",
        any_price: "Any Price",
        advanced_search: "ADVANCED SEARCH",
        verified_stock: "Verified Stock Only",
        direct_auction: "Direct Auction Access",
        insured_shipping: "Insured Shipping",
        featured_vehicles: "Featured Vehicles",
        view_all: "View All",
        top_bar_lang: "Lang",
        fob_price: "FOB Price",
        stock_no: "Stock No",
        discover: "SEARCH",
        brand: "Brand",
        budget: "Max Budget",
        hero_title: "Premium Japanese Auctions Direct from Source",
        hero_subtitle: "150+ auction houses. Updated weekly. You bid, we ship.",
        hero_cta_primary: "Explore Auctions",
        hero_cta_secondary: "How to Buy",
        nav_home: "Home",
        nav_inventory: "Stock",
        nav_used_cars: "Used Cars",
        nav_auctions: "Live Auctions",
        nav_services: "Services",
        nav_japan_auctions: "Japan Auctions",
        nav_how_to_buy: "How to Buy",
        nav_shipping_info: "Shipping Info",
        nav_import_process: "Import Process",
        nav_pricing_costs: "Pricing & Costs",
        nav_blogs: "Blogs",
        nav_faq: "FAQ",
        nav_about: "About Us",
        nav_bank_details: "Bank Details",
        nav_ceo_message: "CEO Message",
        nav_history: "History",
        nav_gallery: "Gallery",
        nav_global_presence: "Global Presence",
        nav_our_30_sec_series: "30 Sec Series",
        nav_partners: "Partners",
        nav_contact: "Contact",
        why_dvm: "Why Choose DVM Japan?",
        trusted_exporter: "Trusted Exporter",
        fast_shipping: "Fast Shipping",
        quality_checks: "Quality Checks",
        premium_collections: "Premium Collections",
        marketplace_subtitle: "Hand-picked, inspected and verified for the highest quality export standards.",
        explore_by_region: "Explore by Region",
        global_hub_eyebrow: "About Us",
        global_hub_title: "Global Hub for Quality Japanese Cars",
        global_hub_desc1: "DVM JAPAN is a leading automotive company specializing in inspected Japanese vehicles and premium car parts. We are committed to providing transparency, reliability, and exceptional customer service.",
        global_hub_desc2: "Our commitment to quality means every vehicle undergoes rigorous inspection and certification. We provide comprehensive logistics support to ensure a seamless car buying experience.",
        discover_more: "Discover More",
        quality_assured: "Quality Assured",
        global_reach: "Global Reach",
        trusted_service: "Trusted Service",
        support_247: "24/7 Support",
        premium_selection: "Premium Selection",
        see_more: "See More",
        explore_collection: "Explore Our Collection",
        new_arrivals: "New Arrivals",
        new_arrivals_msg: "Discover our latest Japanese arrivals.",
        clearance: "Clearance",
        clearance_msg: "Exceptional value on quality stock.",
        premium: "Premium",
        premium_msg: "Selected high-grade luxury vehicles.",
        third_party: "3rd Party",
        third_party_msg: "Partner network verified inventory.",
        login: "Login",
        register: "Register",
        live_rates: "Live Rates",
        faq_eyebrow: "Quick Help",
        faq_title: "Frequently Asked Questions",
        faq_subtitle: "Find answers to common questions about our services, vehicles, & purchasing process",
        inventory_subtitle: "Browse premium Japanese vehicles. Filter by make, model, and year.",
        model: "Model",
        any_model: "Any Model",
        year: "Year",
        any_year: "Any Year",
        year_from: "Year From",
        year_to: "Year To",
        refine_search: "Refine search",
        vehicles_found: "vehicles found",
        filters: "Filters",
        no_vehicles_match: "No vehicles match your filters.",
        clear_filters: "Clear filters"
    },
    ja: {
        search_anything: "何でも検索",
        search_placeholder: "メーカー、モデル、年式、在庫ID...",
        all_brands: "すべてのブランド",
        any_price: "すべての価格",
        advanced_search: "詳細検索",
        verified_stock: "確認済み在庫のみ",
        direct_auction: "オークション直接アクセス",
        insured_shipping: "保険付き配送",
        featured_vehicles: "注目の車両",
        view_all: "すべて見る",
        top_bar_lang: "言語",
        fob_price: "FOB価格",
        stock_no: "在庫番号",
        discover: "検索する",
        brand: "ブランド",
        budget: "予算",
        hero_title: "産地直送のプレミアム日本オークション",
        hero_subtitle: "150以上のオークションハウス。毎週更新。入札、配送。",
        hero_cta_primary: "オークションを探索",
        hero_cta_secondary: "購入方法",
        nav_home: "ホーム",
        nav_inventory: "在庫",
        nav_used_cars: "中古車",
        nav_auctions: "ライブオークション",
        nav_services: "サービス",
        nav_japan_auctions: "日本オークション",
        nav_how_to_buy: "購入方法",
        nav_shipping_info: "配送情報",
        nav_import_process: "輸入プロセス",
        nav_pricing_costs: "価格とコスト",
        nav_blogs: "ブログ",
        nav_faq: "よくある質問",
        nav_about: "会社概要",
        nav_bank_details: "銀行詳細",
        nav_ceo_message: "CEOメッセージ",
        nav_history: "沿革",
        nav_gallery: "ギャラリー",
        nav_global_presence: "グローバルな拠点",
        nav_our_30_sec_series: "30秒シリーズ",
        nav_partners: "パートナー",
        nav_contact: "お問い合わせ",
        why_dvm: "なぜDVMジャパンを選ぶのですか？",
        trusted_exporter: "信頼できる輸出業者",
        fast_shipping: "迅速な配送",
        quality_checks: "品質チェック",
        premium_collections: "プレミアムコレクション",
        marketplace_subtitle: "厳選され、検査され、最高の品質輸出基準のために検証されています。",
        explore_by_region: "地域別に探索",
        global_hub_eyebrow: "私たちについて",
        global_hub_title: "高品質な日本車のグローバルハブ",
        global_hub_desc1: "DVM JAPANは、検査済みの日本車とプレミアムな自動車部品を専門とする、大手自動車関連企業です。透明性、信頼性、そして卓越したカスタマーサービスの提供に全力を尽くしています。",
        global_hub_desc2: "品質へのこだわりとして、すべての車両に厳格な検査と認証を行っています。シームレスな車購入体験を実現するために、包括的な物流サポートを提供しています。",
        discover_more: "詳細を見る",
        quality_assured: "品質保証",
        global_reach: "グローバルな展開",
        trusted_service: "信頼のサービス",
        support_247: "24/7サポート",
        premium_selection: "プレミアムセレクション",
        see_more: "もっと見る",
        explore_collection: "コレクションを探索する",
        new_arrivals: "新着情報",
        new_arrivals_msg: "最新の日本車ラインナップをご覧ください。",
        clearance: "クリアランス",
        clearance_msg: "高品質な車両をお得な価格で。",
        premium: "プレミアム",
        premium_msg: "厳選された高級ラグジュアリー車。",
        third_party: "サードパーティ",
        third_party_msg: "提携ネットワークによる確認済み在庫。",
        login: "ログイン",
        register: "新規登録",
        live_rates: "ライブレート",
        faq_eyebrow: "クイックヘルプ",
        faq_title: "よくある質問",
        faq_subtitle: "当社のサービス、車両、購入プロセスに関する一般的な質問の回答をご覧ください。",
        inventory_subtitle: "プレミアム日本車を閲覧。メーカー、モデル、年式で絞り込み。",
        model: "モデル",
        any_model: "すべてのモデル",
        year: "年式",
        any_year: "すべての年式",
        year_from: "開始年",
        year_to: "終了年",
        refine_search: "検索を絞り込む",
        vehicles_found: "台の車両が見つかりました",
        filters: "フィルター",
        no_vehicles_match: "フィルターに一致する車両はありません。",
        clear_filters: "フィルターをクリア"
    },
    ur: {
        search_anything: "کچھ بھی تلاش کریں",
        search_placeholder: "گاڑی، ماڈل، سال یا اسٹاک آئی ڈی...",
        all_brands: "تمام برانڈز",
        any_price: "کوئی بھی قیمت",
        advanced_search: "ایڈوانس سرچ",
        verified_stock: "صرف تصدیق شدہ اسٹاک",
        direct_auction: "براہ راست نیلامی",
        insured_shipping: "بیما شدہ ترسیل",
        featured_vehicles: "نمایاں گاڑیاں",
        view_all: "سب دیکھیں",
        top_bar_lang: "زبان",
        fob_price: "قیمت",
        stock_no: "اسٹاک نمبر",
        discover: "تلاش کریں",
        brand: "برانڈ",
        budget: "بجٹ",
        hero_title: "براہ راست جاپانی نیلامی سے پریمیم گاڑیاں",
        hero_subtitle: "150+ نیلامی گھر۔ ہفتہ وار اپ ڈیٹ۔ آپ بولی لگائیں، ہم بھیجیں گے۔",
        hero_cta_primary: "نیلامی دیکھیں",
        hero_cta_secondary: "خریدنے کا طریقہ",
        nav_home: "ہوم",
        nav_inventory: "اسٹاک",
        nav_used_cars: "استعمال شدہ گاڑیاں",
        nav_auctions: "لائیو نیلامی",
        nav_services: "خدمات",
        nav_japan_auctions: "جاپانی نیلامی",
        nav_how_to_buy: "خریدنے کا طریقہ",
        nav_shipping_info: "ترسیل کی معلومات",
        nav_import_process: "درآمد کا عمل",
        nav_pricing_costs: "قیمت اور اخراجات",
        nav_blogs: "بلاگز",
        nav_faq: "سوالات",
        nav_about: "ہمارے بارے میں",
        nav_bank_details: "بینک کی تفصیلات",
        nav_ceo_message: "سی ای او کا پیغام",
        nav_history: "تاریخ",
        nav_gallery: "گیلری",
        nav_global_presence: "عالمی موجودگی",
        nav_our_30_sec_series: "30 سیکنڈ سیریز",
        nav_partners: "شراکت دار",
        nav_contact: "رابطہ کریں",
        why_dvm: "ڈی وی ایم جاپان کا انتخاب کیوں کریں؟",
        trusted_exporter: "قابل اعتماد برآمد کنندہ",
        fast_shipping: "تیزی سے ترسیل",
        quality_checks: "کوالٹی چیکس",
        premium_collections: "اعلیٰ معیار کے مجموعے",
        marketplace_subtitle: "اعلیٰ معیار کے برآمدی معیارات کے لیے احتیاط سے منتخب اور تصدیق شدہ۔",
        explore_by_region: "خطے کے لحاظ سے دیکھیں",
        global_hub_eyebrow: "ہمارے بارے میں",
        global_hub_title: "اعلیٰ معیار کی جاپانی گاڑیوں کا عالمی مرکز",
        global_hub_desc1: "ڈی وی ایم جاپان ایک معروف آٹوموٹیو کمپنی ہے جو تصدیق شدہ جاپانی گاڑیوں اور پریمیم پارٹس میں مہارت رکھتی ہے۔ ہم شفافیت، بھروسے اور غیر معمولی کسٹمر سروس فراہم کرنے کے لیے پرعزم ہیں۔",
        global_hub_desc2: "کوالٹی کے لیے ہمارا عزم یہ ہے کہ ہر گاڑی سخت معائنے اور سرٹیفیکیشن سے گزرتی ہے۔ ہم گاڑی خریدنے کے عمل کو ہموار بنانے کے لیے مکمل لاجسٹک سپورٹ فراہم کرتے ہیں۔",
        discover_more: "مزید جانیں",
        quality_assured: "کوالٹی کی ضمانت",
        global_reach: "عالمی رسائی",
        trusted_service: "بھروسہ مند سروس",
        support_247: "24/7 سپورٹ",
        premium_selection: "پریمیم سلیکشن",
        see_more: "مزید دیکھیں",
        explore_collection: "ہمارے کلیکشن کو دیکھیں",
        new_arrivals: "نئی آمد",
        new_arrivals_msg: "ہماری تازہ ترین جاپانی گاڑیوں کو دریافت کریں۔",
        clearance: "کلیئرنس",
        clearance_msg: "اعلیٰ معیار کے اسٹاک پر بہترین قیمت۔",
        premium: "پریمیم",
        premium_msg: "منتخب کردہ اعلیٰ درجے کی لگژری گاڑیاں۔",
        third_party: "تھرڈ پارٹی",
        third_party_msg: "پارٹنر نیٹ ورک کا تصدیق شدہ اسٹاک۔",
        login: "لاگ ان",
        register: "رجسٹر کریں",
        live_rates: "لائیو ریٹس",
        faq_eyebrow: "فوری مدد",
        faq_title: "اکثر پوچھے گئے سوالات",
        faq_subtitle: "ہماری خدمات، گاڑیوں اور خریدنے کے عمل کے بارے میں عام سوالات کے جوابات تلاش کریں۔",
        inventory_subtitle: "اعلیٰ معیار کی جاپانی گاڑیاں دیکھیں۔ برانڈ، ماڈل اور سال کے مطابق فلٹر کریں۔",
        model: "ماڈل",
        any_model: "کوئی بھی ماڈل",
        year: "سال",
        any_year: "کوئی بھی سال",
        year_from: "سال سے",
        year_to: "سال تک",
        refine_search: "سرچ کو بہتر بنائیں",
        vehicles_found: "گاڑیاں ملیں",
        filters: "فلٹرز",
        no_vehicles_match: "آپ کے فلٹرز کے مطابق کوئی گاڑی نہیں ملی۔",
        clear_filters: "فلٹرز ختم کریں"
    }
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>(INITIAL_CURRENCIES[0]);
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
    const [currencies, setCurrencies] = useState<Currency[]>(INITIAL_CURRENCIES);
    const [lastUpdated, setLastUpdated] = useState<string>("");

    // Fetch live rates from highly reliable v6 API
    useEffect(() => {
        const fetchRates = async () => {
            try {
                // ExchangeRate-API v6 (standard free endpoint)
                const res = await fetch('https://open.er-api.com/v6/latest/USD');
                const data = await res.json();

                if (data.result === 'success') {
                    const newCurrencies = INITIAL_CURRENCIES.map(curr => ({
                        ...curr,
                        rate: data.rates[curr.code] || curr.rate
                    }));
                    setCurrencies(newCurrencies);
                    setLastUpdated(new Date(data.time_last_update_utc).toLocaleTimeString());

                    // Update selected currency rate if it changed
                    const updatedSelected = newCurrencies.find(c => c.code === selectedCurrency.code);
                    if (updatedSelected) setSelectedCurrency(updatedSelected);
                }
            } catch (error) {
                console.error('Failed to fetch high-accuracy rates:', error);
            }
        };

        fetchRates();
        // Check every 10 mins for 100% precision
        const interval = setInterval(fetchRates, 600000);
        return () => clearInterval(interval);
    }, [selectedCurrency.code]);

    const setCurrency = (code: string) => {
        const currency = currencies.find(c => c.code === code);
        if (currency) {
            setSelectedCurrency(currency);
            localStorage.setItem('dvm_currency', code);
        }
    };

    const setLanguage = (code: string) => {
        const language = LANGUAGES.find(l => l.code === code);
        if (language) {
            setSelectedLanguage(language);
            localStorage.setItem('dvm_language', code);
            // In a real app with i18n, you'd trigger i18n.changeLanguage here
        }
    };

    // Load from local storage and auto-detect
    useEffect(() => {
        const savedCurrency = localStorage.getItem('dvm_currency');
        if (savedCurrency) {
            setCurrency(savedCurrency);
        }

        const savedLang = localStorage.getItem('dvm_language');
        if (savedLang) {
            setLanguage(savedLang);
        } else {
            // Auto-detect browser language
            const browserLang = window.navigator.language.split('-')[0];
            const supported = LANGUAGES.find(l => l.code === browserLang);
            if (supported) {
                setLanguage(supported.code);
            }
        }
    }, [currencies]);

    const convertPrice = useCallback((price: number, fromCurrency: string = "USD") => {
        // 1. Normalize to USD if base is different
        let usdPrice = price;
        if (fromCurrency !== "USD") {
            const baseCurrency = currencies.find(c => c.code === fromCurrency);
            if (baseCurrency && baseCurrency.rate !== 0) {
                usdPrice = price / baseCurrency.rate;
            }
        }

        // 2. Convert from USD to selected currency
        const converted = usdPrice * selectedCurrency.rate;

        // JPY and other currencies without decimals should be rounded
        const fractionDigits = ["JPY", "KRW", "VND"].includes(selectedCurrency.code) ? 0 : 2;

        return `${selectedCurrency.symbol}${converted.toLocaleString(undefined, {
            maximumFractionDigits: fractionDigits,
            minimumFractionDigits: fractionDigits
        })}`;
    }, [selectedCurrency, currencies]);

    const formatPrice = useCallback((price: number, code?: string) => {
        const curr = code ? (currencies.find(c => c.code === code) || selectedCurrency) : selectedCurrency;
        return `${curr.symbol}${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }, [selectedCurrency, currencies]);

    const t = useCallback((key: string) => {
        return TRANSLATIONS[selectedLanguage.code]?.[key] || TRANSLATIONS['en'][key] || key;
    }, [selectedLanguage]);

    return (
        <CurrencyContext.Provider
            value={{
                selectedCurrency,
                setCurrency,
                selectedLanguage,
                setLanguage,
                currencies,
                languages: LANGUAGES,
                convertPrice,
                formatPrice,
                t,
                lastUpdated
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
