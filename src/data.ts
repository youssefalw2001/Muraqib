/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BroQuiz, ChallengerAttempt, BroShopItem } from './types';

export const INITIAL_QUIZ: BroQuiz = {
  id: 'quiz-1',
  displayName: 'Sultan Al-Harbi / سارة الوفية',
  slug: 'wafi.vip',
  theme: 'onyx',
  questions: [
    {
      id: 'q-1',
      text: 'Who is my absolute favorite football player / athlete? | من هو لاعبي أو رياضي المفضل على الإطلاق؟',
      options: ['Cristiano Ronaldo 🐐 | كريستيانو رونالدو', 'Lionel Messi | ليونيل ميسي', 'Neymar Jr | نيمار جونيور', 'Salem Al-Dawsari | سالم الدوسري'],
      correctIdx: 0,
      difficulty: 'easy',
      roastComment: 'Our nights on Discord are literally arguing about Ronaldo! / سهراتنا على ديسكورد والاتصال كلها نقاشات دفاعاً عن رونالدو يا مخفق!'
    },
    {
      id: 'q-2',
      text: 'Where is my ultimate 2 AM late-night comfort crave spot? | أين أذهب لتناول وجبتي المفضلة في الثانية فجراً؟',
      options: ['Al Baik (Spicy Chicken) 🍗 | البيك (مسحب حراق)', 'Maestro Pizza | مايسترو بيتزا', 'McDonald\'s | ماكدونالدز', 'Local Shawarma Stand | شاورما على الفحم'],
      correctIdx: 0,
      difficulty: 'easy',
      roastComment: 'No Al Baik?! You are legally barred from the passenger shotgun seat now. / كيف تخطئ في عشق البيك الحراق؟ تذكرة الراكب سُحبت منك فوراً!'
    },
    {
      id: 'q-3',
      text: 'What game aspect makes me rage quit fastest? | ما هو الشيء الذي يخرجني عن طوري ويجعلني أنسحب من اللعبة غاضباً؟',
      options: ['Teammates throwing the match | تخريب رفاقي للمواجهة وتهاونهم', 'Lag / 999ms ping spikes | ارتفاع البينق والاق الشديد', 'Losing a 1v1 duel | الخسارة في مواجهة ثنائية حاسمة', 'Enemy spamming emotes | استهزاء الخصم برقصات مستفزة'],
      correctIdx: 0,
      difficulty: 'medium',
      roastComment: 'You have heard me complain about bad teammates throwing a thousand times! / لقد استمعت لصراخي على الرفاق المهملين ألف مرة كيف تخطئ فيها!'
    },
    {
      id: 'q-4',
      text: 'What is my actual absolute dream car? | ما هي سيارة أحلامي الحقيقية والقصوى؟',
      options: ['Porsche 911 GT3 RS 🏎️ | بورش 911 جي تي 3', 'Nissan GT-R | نيسان جي تي آر', 'Mercedes G63 AMG | مرسيدس جي class', 'Tesla Model S Plaid | تسلا بلايد الرياضية'],
      correctIdx: 0,
      difficulty: 'medium',
      roastComment: 'Porsche is the only correct answer. Go walk on foot. / البورش هي عشق الذات والروح فقط، عد لبيتك مشياً على الأقدام!'
    },
    {
      id: 'q-5',
      text: 'If I win half a million SAR, what will I do first? | لو كسبت نصف مليون ريال سعودي، ما هو أول شيء سأفعله؟',
      options: ['Take us to Tokyo 🇯🇵 | السفر بجروب الأصدقاء لليابان', 'Buy a luxury setup | إقامة استوديو وتجهيز قيمنق أسطوري', 'Launch a specialty coffee brand | إطلاق علامة تجارية لقهوة مختصة', 'Retire on a camel farm | التقاعد وشراء مزرعة إبل هادئة'],
      correctIdx: 0,
      difficulty: 'hard',
      roastComment: 'Tokyo trip! You definitely do not listen when I talk. / الحلم هو طوكيو دائماً! أنت لا تنصت لأمنياتي إطلاقاً.'
    },
    {
      id: 'q-6',
      text: 'If we get into trouble, what is the most likely reason? | إذا وقعنا في مأزق أو ورطة جماعية، ما هو السبب الأغلب؟',
      options: ['Drifting in the red sands 🚙 | التدوير والتطعيس في النفود والبر', 'Arguing too loud at a premium café | الجدال بصوت مرتفع في مقهى راقٍ', 'Getting scammed in a web3 project | التعرض لخديعة بمشروع رقمي مشبوه', 'Sneaking into a VIP private event | التسلل لحفلة كبار الشخصيات المغلقة'],
      correctIdx: 0,
      difficulty: 'hard',
      roastComment: 'Sands drifting! You think I cannot drift? Mindblowing. / التطعيس وجو النفود! تظن أن هدوئي يمنعني من الإثارة؟ تهمة باطلة.'
    }
  ],
  rewardWinner: 'Gourmet Al Baik meal on me + Luxury highway cruise 🏆 / وجبة بيك حراق على حسابي + جولة ملكية فاخرة',
  dareLevel1: 'Post a custom story with the clown face filter for 2 hours 🤡 / تنزيل ستوري بسناب شات بفلتر الكلون المهرج لمدة ساعتين',
  dareLevel2: 'Sing a dramatic vocal 15s note of our group favorite song 🎵 / تسجيل مقطع صوتي مضحك 15 ثانية وأنت تغني شيلتنا المفضلة بأعلى صوتك',
  dareLevel3: 'Apple Pay me 15 SAR for my specialty morning dose immediately ☕ / تحويل 15 ريال فوراً لشراء قهوة الصباح المختصة عبر آبل باي',
  voiceNoteDataUrl: null,
  voiceNoteTemplateId: 'roast_clown',
  createdAt: '26-05-2026'
};

export const INITIAL_CHALLENGERS: ChallengerAttempt[] = [
  {
    id: 'c-1',
    quizId: 'quiz-1',
    challengerName: 'Fahad Al-Qahtani / فهد القحطاني',
    score: 6,
    totalQuestions: 6,
    failedOnQuestionText: null,
    failedLevel: 'none',
    dareAssigned: 'None! True Companion unlocked. / لا يوجد! الصاحب الوافي بالقمة',
    status: 'survived',
    city: 'Riyadh, KSA',
    timestamp: '5 mins ago',
    avatarSeed: 3,
    excuseMsg: 'Pristine score. I know you better than you know yourself! / نتيجة كاملة وافية، أعرف خفاياك وتفاصيلك كبصمة كفي!',
    deviceType: 'iPhone 15 Pro Max'
  },
  {
    id: 'c-2',
    quizId: 'quiz-1',
    challengerName: 'Amal.dxb / أمل دبي',
    score: 3,
    totalQuestions: 6,
    failedOnQuestionText: 'What is my actual absolute dream car? | ما هي سيارة أحلامي الحقيقية والقصوى؟',
    failedLevel: 'level2',
    dareAssigned: 'Sing a dramatic vocal 15s note of our group favorite song 🎵 / غناء شيلتنا المفضلة بصوت مضحك دقيقة',
    status: 'dare_accepted',
    city: 'Dubai, UAE',
    timestamp: '2 hours ago',
    avatarSeed: 8,
    excuseMsg: 'I honestly felt you loved the GT-R classic! / ظننت أن حبك متجه لسيارات الجي تي آر الكلاسيكية، المعذرة!',
    deviceType: 'iPhone 15 Pro'
  },
  {
    id: 'c-3',
    quizId: 'quiz-1',
    challengerName: 'Turki_Y2K / تركي العتيبي',
    score: 1,
    totalQuestions: 6,
    failedOnQuestionText: 'Where is my ultimate 2 AM late-night comfort crave spot? | أين أذهب لتناول وجبتي المفضلة في الثانية فجراً؟',
    failedLevel: 'level1',
    dareAssigned: 'Post a custom story with the clown face filter for 2 hours 🤡 / تنزيل ستوري بسناب شات بفلتر الكلون المهرج لمدة ساعتين',
    status: 'wimped_out',
    city: 'Jeddah, KSA',
    timestamp: '4 hours ago',
    avatarSeed: 1,
    excuseMsg: 'The local shawarma stand is 10x better though! / شاورما الفحم المحلية ألذ بمئة مرة، اختبارك منحاز!',
    deviceType: 'iPhone 14'
  }
];

export const BRO_SHOP_ITEMS: BroShopItem[] = [
  {
    id: 'bs-immunity',
    name: 'Dare Immunity Shield',
    arabicName: 'درع الهروب من التحدي',
    description: 'Bypass any checkpoint dare instantly if you fail. Stay clean.',
    priceUSD: 1.99,
    priceSAR: 7.5,
    badge: 'POPULAR',
    glowColor: 'from-[#3B82F6] to-[#60A5FA]',
    benefit: 'Saves your dignity + Skips story roasting completely',
    iconName: 'Shield'
  },
  {
    id: 'bs-royalty',
    name: 'Holographic BroCard Skin',
    arabicName: 'البطاقة الذهبية اللامعة',
    description: 'Bling out your high-res results card with gold animated glitter.',
    priceUSD: 4.99,
    priceSAR: 18,
    badge: 'EXCLUSIVE',
    glowColor: 'from-[#FACC15] to-[#EAB308]',
    benefit: 'Custom Gold 3D Sticker + Priority Leaderboard Row',
    iconName: 'Crown'
  },
  {
    id: 'bs-voice',
    name: 'Custom AI Voice Roast Pack',
    arabicName: 'مجموعة أصوات الروست الرهيبة',
    description: 'Unlock 5 legendary Arab voice actor voices to roast your failed friends.',
    priceUSD: 7.99,
    priceSAR: 30,
    badge: 'VIRAL',
    glowColor: 'from-[#EF4444] to-[#EC4899]',
    benefit: 'Pre-recorded memes + Dramatic tape soundboards',
    iconName: 'Volume2'
  }
];

export const GCC_CITIES = [
  'Riyadh, KSA',
  'Jeddah, KSA',
  'Dubai, UAE',
  'Abu Dhabi, UAE',
  'Kuwait City, KWT',
  'Salmiya, KWT',
  'Doha, QAT',
  'Manama, BAH',
  'Muscat, OMN',
  'Khobar, KSA'
];
