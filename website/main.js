/* SafarCare website — language switching, ticket decoder, launch form. */
(function () {
  'use strict';

  // Somali and Arabic copy. English is read from the page itself.
  const T = {
    so: {
      skip: 'U gudub nuxurka',
      navHow: 'Sida ay u shaqeyso', navFeatures: 'Astaamaha', navGuide: 'Hagaha garoonka', navPrivacy: 'Ilaalinta xogta',
      ctaPreviewShort: 'Isku day', ctaPreview: 'Isku day muuqaalka app-ka', ctaNotify: 'Ii sheeg marka la soo saaro',
      heroTitle: 'Fahan tigidhkaaga ka hor intaadan garoonka gaadhin.',
      heroLede: 'SafarCare waxay akhrisaa tigidhkaaga duulimaadka — sawir-shaashad, sawir, PDF ama sawir WhatsApp ah — waxayna kuugu sharraxdaa erayo fudud: duulimaadyadaada, meelaha aad diyaarad ku beddelayso iyo inta shandad ee laguu oggol yahay.',
      heroNote: 'Android iyo iPhone. Af-Ingiriis, Af-Soomaali iyo Carabi. Bilaash, xayeysiis la\'aan.',
      decoderHint: 'Riix wax kasta oo ku qoran tigidhkan si aad u ogaato macnihiisa.',
      decoderFoot: 'Tigidh tusaale ah oo xog been-abuur ah leh.',
      whyTitle: 'Tigidhada waxaa loo qoraa nidaamyada shirkadaha, ma aha rakaabka.',
      whyP1: 'PNR, HK1, 2PC, lambar terminaal, laba duulimaad hal bog. Qof markii ugu horreysay dibadda u safraya — ama qof caawinaya waalid ama qaraabo safraysa — tigidhku wuxuu keeni karaa su\'aalo ka badan jawaabaha.',
      whyP2: 'SafarCare waxay u beddeshaa qorshe cad oo aad ku akhriyi karto luqaddaada, waxayna si cad kuugu sheegtaa marka wax aan tigidhka ku jirin, si aad u ogaato waxa aad weydiinayso shirkadda diyaaradda.',
      howTitle: 'Tigidhka ilaa diyaargarowga, saddex tallaabo',
      step1Title: 'Iskaan garee tigidhkaaga', step1Body: 'Sawir qaad, dooro sawir-shaashad ama sawir WhatsApp, ama fur PDF-ka. Tigidhka waxaa lagu akhriyaa taleefankaaga.',
      step2Title: 'Hubi waxa la helay', step2Body: 'Arag duulimaadyadaada, saacadaha, xiriirrada iyo shandadaha. Wixii aan tigidhka ku jirin waxaa lagu calaamadeeyaa “Lama helin” — marnaba lama qiyaaso. Sax ama buuxi xog kasta.',
      step3Title: 'Ku diyaargarow kalsooni', step3Body: 'Kaydi safarka oo hel liis loogu talagalay, xusuusin waxa aad hubinayso, iyo hage garoonka tallaabo tallaabo ah.',
      featTitle: 'Wax kasta oo ku saabsan safarkaaga, hal meel',
      fBagTitle: 'Xaddiga shandadahaaga gaarka ah', fBagBody: 'Waxaa laga akhriyaa tigidhkaaga — ma aha xeer guud oo shirkadeed. Shandadaha la dhiibo iyo kuwa gacanta waa la kala saaraa oo si fudud ayaa loo sharraxaa. Haddii tigidhkaagu aanu caddayn, SafarCare way sheegtaa oo waxay kuu sheegtaa inaad ka hubiso shirkadda.',
      code2pc: 'Laba shandad oo la dhiibo', code23: 'Ilaa 23 kg mid kasta, marka la raaco gabalada', code30: 'Kaligiis: 30 kg wadar ahaan', codeNil: 'Shandad la dhiibo kuma jirto',
      fTripsTitle: 'Safarradayda', fTripsBody: 'Safarrada soo socda iyo kuwii hore, mid kasta oo leh duulimaadyadiisa, faahfaahinta ballanta iyo tigidhka asalka ah — oo si qarsoon ugu kaydsan taleefankaaga.',
      fListTitle: 'Liis safar kasta', fListBody: 'Baasaboorka, transit-ka, hoteelka, xirxirashada iyo goorta aad garoonka gaadhayso. Calaamadee, ka saar wixii aan ku khusayn, ku dar kuwaaga.',
      fReqTitle: 'Xusuusinta shuruudaha safarka', fReqBody: 'Waxay kuu xusuusinaysaa inaad hubiso dhicitaanka baasaboorka, shuruudaha fiisaha, dukumentiyada transit-ka iyo caymiska — safaaradda, xafiiska socdaalka ama shirkadda diyaaradda.',
      guideTitle: 'Markaaga ugu horreysa ee garoon caalami ah', guideBody: 'App-ku wuxuu kugu hagaa marxalad kasta tallaabooyin fudud, si aysan waxba kuugu noqon la yaab.',
      g1: 'Check-in iyo dhiibista shandadaha', g2: 'Amniga', g3: 'Hubinta baasaboorka', g4: 'Helitaanka albaabka', g5: 'Fuulista', g6: 'Beddelka diyaaradda', g7: 'Hubinta baasaboorka gaadhista', g8: 'Qaadashada shandadaha',
      langsTitle: 'Luqadda aad ku fikirto', langsBody: 'App-ka oo dhan wuxuu ku shaqeeyaa Af-Ingiriis, Af-Soomaali iyo Carabi — oo ay ku jirto qoraalka midig-ilaa-bidix ee Carabiga. Beddel goor kasta.',
      promiseTitle: 'Cad waxa aan qabanno iyo waxa aanaan qaban', promiseBody: 'Xogta safarku waa inay sax ahaato. Sidaa darteed SafarCare waxaa loo dhisay inay daacad ka ahaato xadkeeda.',
      p1t: 'Marnaba ma qiyaasno', p1b: 'Haddii xog aanay tigidhkaaga ku jirin, waxaad arki doontaa “Lama helin” iyo waxa aad weydiinayso shirkadda.',
      p2t: 'Ma go\'aamino fiisaha', p2b: 'Xeerarka fiisaha waxay ku xiran yihiin baasaboorkaaga oo si joogto ah ayay isu beddelaan. SafarCare waxay kuu xusuusinaysaa inaad ka hubiso safaaradda ama hay\'adda socdaalka.',
      p3t: 'Tigidhkaagu wuxuu ku jiraa taleefankaaga', p3b: 'Tigidhada waxaa lagu akhriyaa qalabkaaga oo si qarsoon ayaa loo kaydiyaa. Akoonku waa ikhtiyaari oo kaliya wuxuu kaydiyaa faahfaahinta safarka — marnaba faylka tigidhka.',
      p4t: 'Xayeysiis ma jiro, xog lama iibiyo', p4b: 'Dukumentiyadaada marnaba qof kale laguma tuso, lama iibiyo, xayeysiisna looma isticmaalo. Tirtir wax kasta goor kasta.',
      faqTitle: 'Su\'aalo',
      q1: 'SafarCare ma bilaash baa?', a1: 'Haa. SafarCare waa bilaash, xayeysiisna ma leh.',
      q2: 'Tigidhadee ayay akhriyi kartaa?', a2: 'Sawir-shaashadda e-tigidhka, sawirrada tigidhada daabacan, tigidhada PDF iyo xaqiijinta ballanta, iyo sawirrada tigidhka ee WhatsApp. Haddii sawirku aad u qallafsan yahay, app-ku wuxuu kuu sheegaa sida aad u qaado mid ka wanaagsan.',
      q3: 'Ma ii sheegi kartaa inaan fiiso u baahanahay?', a3: 'Maya. Waxay kuu xusuusinaysaa inaad ka hubiso shuruudaha fiisaha, transit-ka iyo baasaboorka hay\'adda rasmiga ah, waxayna kuu oggolaanaysaa inaad qorto waxa ay kuu sheegeen.',
      q4: 'Ma u baahanahay akoon?', a4: 'Maya. Wax kasta wuu shaqeeyaa la\'aantiis. Akoonku kaliya wuxuu kaydiyaa safarradaada si aad ugu soo celiso taleefan cusub.',
      q5: 'Goorma ayaan soo dejisan karaa?', a5: 'SafarCare waxaa loo diyaarinayaa Google Play iyo App Store. Hoos ku qor iimaylkaaga, waxaan kuu sheegi doonaa marka uu diyaar noqdo.',
      launchTitle: 'Safar diyaarsan. Safar kalsooni leh.', launchBody: 'Noqo kan ugu horreeya ee ogaada marka SafarCare diyaar u noqoto soo dejin. Inta ka horreysa, isku day muuqaalka browser-kaaga.',
      emailLabel: 'Ciwaanka iimaylka', emailError: 'Qor iimayl sida name@example.com.', notifySubmit: 'Ii sheeg marka la soo saaro',
      notifyFine: 'Kaliya waxaan kuu soo diri doonaa iimayl ku saabsan soo saarista. Ka bax goor kasta.',
      footTag: 'Safar diyaarsan. Safar kalsooni leh.', footNote: 'SafarCare waxay bixisaa hage kaliya. Had iyo jeer ka xaqiiji xogta muhiimka ah shirkadda diyaaradda iyo hay\'adaha khuseeya.',
    },
    ar: {
      skip: 'انتقل إلى المحتوى',
      navHow: 'كيف يعمل', navFeatures: 'المزايا', navGuide: 'دليل المطار', navPrivacy: 'الخصوصية',
      ctaPreviewShort: 'جرّب العرض', ctaPreview: 'جرّب عرض التطبيق', ctaNotify: 'أخبرني عند الإطلاق',
      heroTitle: 'افهم تذكرتك قبل أن تصل إلى المطار.',
      heroLede: 'يقرأ SafarCare تذكرة طيرانك — لقطة شاشة أو صورة أو ملف PDF أو صورة من واتساب — ويشرحها بكلمات بسيطة: رحلاتك، وأين تغيّر الطائرة، وكم حقيبة يُسمح لك بها بالضبط.',
      heroNote: 'لأندرويد وآيفون. بالإنجليزية والصومالية والعربية. مجاني وبلا إعلانات.',
      decoderHint: 'اضغط على أي شيء مكتوب في هذه التذكرة لترى معناه.',
      decoderFoot: 'تذكرة نموذجية ببيانات غير حقيقية.',
      whyTitle: 'التذاكر مكتوبة لأنظمة شركات الطيران، لا للمسافرين.',
      whyP1: 'PNR وHK1 و2PC ورقم المبنى ورحلتان في صفحة واحدة. لمن يسافر إلى الخارج لأول مرة — أو يساعد والدًا أو قريبًا على السفر — قد تثير التذكرة أسئلة أكثر مما تجيب.',
      whyP2: 'يحوّلها SafarCare إلى خطة واضحة تقرؤها بلغتك، ويخبرك بصراحة عندما لا يكون أمر ما مذكورًا في التذكرة، لتعرف ماذا تسأل شركة الطيران.',
      howTitle: 'من التذكرة إلى الاستعداد في ثلاث خطوات',
      step1Title: 'امسح تذكرتك', step1Body: 'التقط صورة، أو اختر لقطة شاشة أو صورة من واتساب، أو افتح ملف PDF. تُقرأ التذكرة على هاتفك.',
      step2Title: 'راجع ما وجده', step2Body: 'اطّلع على رحلاتك وأوقاتها والتوقفات والأمتعة. كل ما لا تُظهره التذكرة يُعلَّم «غير موجود» — ولا يُخمَّن أبدًا. صحّح أي تفصيل أو أكمله.',
      step3Title: 'استعد بثقة', step3Body: 'احفظ الرحلة واحصل على قائمة خاصة بها، وتذكيرات بما يجب التحقق منه، ودليل للمطار خطوة بخطوة.',
      featTitle: 'كل ما يخص رحلتك في مكان واحد',
      fBagTitle: 'الأمتعة المسموح بها لك أنت', fBagBody: 'تُقرأ من تذكرتك — لا من قاعدة عامة لشركة الطيران. تُفصل الأمتعة المسجّلة عن حقيبة المقصورة وتُشرح ببساطة. وإن لم تكن تذكرتك واضحة، يقول SafarCare ذلك وينصحك بالتحقق من شركة الطيران.',
      code2pc: 'حقيبتان مسجّلتان', code23: 'حتى 23 كغ لكل حقيبة، عند ذكرها مع عدد القطع', code30: 'وحدها: 30 كغ إجمالًا', codeNil: 'لا تشمل حقيبة مسجّلة',
      fTripsTitle: 'رحلاتي', fTripsBody: 'الرحلات القادمة والسابقة، كل منها برحلاتها وتفاصيل الحجز والتذكرة الأصلية — محفوظة مشفّرة على هاتفك.',
      fListTitle: 'قائمة لكل رحلة', fListBody: 'جواز السفر والعبور والفندق والحقائب وموعد الوصول إلى المطار. ضع علامة على ما أنجزته، واحذف ما لا يخصك، وأضف عناصرك.',
      fReqTitle: 'تذكيرات متطلبات السفر', fReqBody: 'يذكّرك بالتحقق من صلاحية جوازك ومتطلبات التأشيرة ووثائق العبور والتأمين — لدى السفارة أو مكتب الهجرة أو شركة الطيران.',
      guideTitle: 'مرّتك الأولى في مطار دولي', guideBody: 'يرشدك التطبيق في كل مرحلة بخطوات بسيطة، حتى لا يفاجئك شيء.',
      g1: 'تسجيل الوصول وتسليم الحقائب', g2: 'التفتيش الأمني', g3: 'الجوازات', g4: 'العثور على البوابة', g5: 'الصعود', g6: 'تغيير الطائرة', g7: 'جوازات الوصول', g8: 'استلام الحقائب',
      langsTitle: 'باللغة التي تفكّر بها', langsBody: 'يعمل التطبيق كله بالإنجليزية والصومالية والعربية — مع اتجاه من اليمين إلى اليسار للعربية. غيّر اللغة متى شئت.',
      promiseTitle: 'واضحون فيما نفعله وما لا نفعله', promiseBody: 'معلومات السفر يجب أن تكون صحيحة، لذلك صُمّم SafarCare ليكون صريحًا بشأن حدوده.',
      p1t: 'لا نخمّن أبدًا', p1b: 'إن لم يكن تفصيل ما في تذكرتك، فسترى «غير موجود» وما الذي تسأل عنه شركة الطيران.',
      p2t: 'لا نقرّر بشأن التأشيرات', p2b: 'تعتمد قواعد التأشيرة على جواز سفرك وتتغير كثيرًا، لذلك يذكّرك SafarCare بالتحقق من السفارة أو سلطة الهجرة.',
      p3t: 'تذكرتك تبقى على هاتفك', p3b: 'تُقرأ التذاكر على جهازك وتُحفظ مشفّرة. الحساب اختياري ويحفظ نسخة من تفاصيل رحلاتك فقط — لا ملف التذكرة أبدًا.',
      p4t: 'لا إعلانات ولا بيع للبيانات', p4b: 'لا تُعرض وثائقك على أحد ولا تُباع ولا تُستخدم للإعلانات. احذف ما تشاء في أي وقت.',
      faqTitle: 'أسئلة',
      q1: 'هل SafarCare مجاني؟', a1: 'نعم. SafarCare مجاني ولا يحتوي على إعلانات.',
      q2: 'ما التذاكر التي يقرؤها؟', a2: 'لقطات شاشة التذاكر الإلكترونية، وصور التذاكر المطبوعة، وتذاكر PDF وتأكيدات الحجز، وصور التذاكر المرسلة عبر واتساب. إن كانت الصورة غير واضحة، يخبرك التطبيق كيف تلتقط صورة أفضل.',
      q3: 'هل يخبرني إن كنت أحتاج إلى تأشيرة؟', a3: 'لا. يذكّرك بالتحقق من متطلبات التأشيرة والعبور وجواز السفر لدى الجهة الرسمية، ويتيح لك تدوين ما قالوه لك.',
      q4: 'هل أحتاج إلى حساب؟', a4: 'لا. كل شيء يعمل بدونه. الحساب يحفظ نسخة من رحلاتك فقط لتستعيدها على هاتف جديد.',
      q5: 'متى يمكنني تنزيله؟', a5: 'يجري تجهيز SafarCare لمتجري Google Play وApp Store. اترك بريدك الإلكتروني أدناه وسنخبرك عندما يصبح جاهزًا.',
      launchTitle: 'سافر مستعدًا. سافر بثقة.', launchBody: 'كن أول من يعرف عندما يصبح SafarCare جاهزًا للتنزيل. وحتى ذلك الحين، جرّب العرض في متصفحك.',
      emailLabel: 'البريد الإلكتروني', emailError: 'اكتب بريدًا إلكترونيًا مثل name@example.com.', notifySubmit: 'أخبرني عند الإطلاق',
      notifyFine: 'لن نراسلك إلا بشأن الإطلاق. يمكنك إلغاء الاشتراك في أي وقت.',
      footTag: 'سافر مستعدًا. سافر بثقة.', footNote: 'يقدّم SafarCare إرشادات فقط. تحقّق دائمًا من التفاصيل المهمة مع شركة الطيران والجهات المعنية.',
    },
  };

  // What each code on the sample ticket means.
  const D = {
    en: {
      from: ['Hargeisa — where you start', 'HGA is the three-letter code for Hargeisa\'s Egal International Airport.'],
      via: ['Addis Ababa — where you change planes', 'ADD is Addis Ababa Bole International Airport. A stop here means you have a connecting flight.'],
      to: ['Dubai — your destination', 'DXB is Dubai International Airport, where your journey ends.'],
      name: ['Passenger name', 'Surname first, then given name and title (MS means Ms). It should match your passport exactly.'],
      pnr: ['Booking reference', 'Your six-character booking code, also called PNR. Use it to find or change your booking with the airline.'],
      flt: ['Flight number', 'ET is the airline\'s code (Ethiopian Airlines) and 908 is the flight. Look for it on the airport screens.'],
      date: ['19 November at 14:30', 'The date and departure time, in local time at the airport you leave from.'],
      status: ['Booking status: confirmed', 'HK1 means one seat is confirmed for you. If you see a different status, ask your airline.'],
      cl: ['Booking class', 'Y is the airline\'s code for an Economy fare.'],
      bag: ['2 bags, up to 23 kg each', 'You can check in two suitcases. Each one must weigh 23 kg or less.'],
      cabin: ['Cabin baggage: not found', 'This ticket doesn\'t show a cabin allowance. SafarCare won\'t guess — it tells you to check with your airline.'],
    },
    so: {
      from: ['Hargeysa — meesha aad ka bilaabayso', 'HGA waa koodka 3-da xaraf ah ee Garoonka Caalamiga ah ee Cigaal ee Hargeysa.'],
      via: ['Addis Ababa — meesha aad diyaarad ku beddelayso', 'ADD waa Garoonka Caalamiga ah ee Bole ee Addis Ababa. Joogsi halkan ah wuxuu ka dhigan yahay duulimaad xiriir ah.'],
      to: ['Dubay — meesha aad u socoto', 'DXB waa Garoonka Caalamiga ah ee Dubay, halkaas oo safarkaagu ku dhammaanayo.'],
      name: ['Magaca rakaabka', 'Magaca qoyska marka hore, kadib magaca iyo cinwaanka (MS waa marwo/gabadh). Waa inuu si sax ah ula mid ahaadaa baasaboorkaaga.'],
      pnr: ['Lambarka ballanta', 'Koodka ballantaada ee 6-da xaraf ah, oo sidoo kale loo yaqaan PNR. Ku isticmaal si aad u hesho ama u beddesho ballantaada.'],
      flt: ['Lambarka duulimaadka', 'ET waa koodka shirkadda (Ethiopian Airlines), 908-na waa duulimaadka. Ka raadi shaashadaha garoonka.'],
      date: ['19 Nofeembar saacadda 14:30', 'Taariikhda iyo waqtiga ambabaxa, waqtiga maxalliga ah ee garoonka aad ka ambabaxayso.'],
      status: ['Xaaladda ballanta: waa la xaqiijiyay', 'HK1 macnaheedu waa hal kursi oo laguu xaqiijiyay. Haddii aad aragto xaalad kale, weydii shirkadda.'],
      cl: ['Heerka ballanta', 'Y waa koodka shirkadda ee qiimaha Economy.'],
      bag: ['2 shandad, ilaa 23 kg mid kasta', 'Waxaad dhiibi kartaa laba shandad. Mid kasta waa inuu ahaadaa 23 kg ama ka yar.'],
      cabin: ['Shandadda gacanta: lama helin', 'Tigidhkani ma muujinayo xaddiga shandadda gacanta. SafarCare ma qiyaasto — waxay kuu sheegtaa inaad ka hubiso shirkadda.'],
    },
    ar: {
      from: ['هرجيسا — نقطة انطلاقك', 'HGA هو الرمز المكوّن من ثلاثة أحرف لمطار عقال الدولي في هرجيسا.'],
      via: ['أديس أبابا — حيث تغيّر الطائرة', 'ADD هو مطار بولي الدولي في أديس أبابا. التوقف هنا يعني أن لديك رحلة متابعة.'],
      to: ['دبي — وجهتك', 'DXB هو مطار دبي الدولي، حيث تنتهي رحلتك.'],
      name: ['اسم المسافر', 'اسم العائلة أولًا، ثم الاسم الأول واللقب (MS تعني السيدة). يجب أن يطابق جواز سفرك تمامًا.'],
      pnr: ['رقم الحجز', 'رمز حجزك المكوّن من ستة أحرف، ويُسمى أيضًا PNR. استخدمه للعثور على حجزك أو تغييره لدى شركة الطيران.'],
      flt: ['رقم الرحلة', 'ET رمز شركة الطيران (الخطوط الإثيوبية) و908 رقم الرحلة. ابحث عنه على شاشات المطار.'],
      date: ['19 نوفمبر الساعة 14:30', 'تاريخ المغادرة ووقتها بالتوقيت المحلي للمطار الذي تغادر منه.'],
      status: ['حالة الحجز: مؤكَّد', 'HK1 تعني أن مقعدًا واحدًا مؤكَّد لك. إن رأيت حالة أخرى فاسأل شركة الطيران.'],
      cl: ['درجة الحجز', 'Y هو رمز شركة الطيران لسعر الدرجة السياحية.'],
      bag: ['حقيبتان، حتى 23 كغ لكل منهما', 'يمكنك تسجيل حقيبتين. يجب ألا يزيد وزن كل واحدة على 23 كغ.'],
      cabin: ['حقيبة المقصورة: غير موجود', 'لا تُظهر هذه التذكرة وزن حقيبة المقصورة. لا يخمّن SafarCare — بل ينصحك بالتحقق من شركة الطيران.'],
    },
  };

  const html = document.documentElement;
  const nodes = Array.from(document.querySelectorAll('[data-i18n]'));
  const en = {};
  nodes.forEach((n) => { en[n.dataset.i18n] = n.textContent; });
  T.en = en;

  let lang = 'en';
  let field = 'bag';

  function setLang(next, save) {
    lang = T[next] ? next : 'en';
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    nodes.forEach((n) => {
      const v = T[lang][n.dataset.i18n] || en[n.dataset.i18n];
      if (v) n.textContent = v;
    });
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    const fl = document.getElementById('form-lang');
    if (fl) fl.value = lang;
    showField(field);
    if (save) { try { localStorage.setItem('safarcare-lang', lang); } catch (e) { /* storage off */ } }
  }

  function showField(key) {
    field = key;
    const btn = document.querySelector(`[data-field="${key}"]`);
    document.querySelectorAll('.code-btn').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    const [title, body] = D[lang][key];
    const box = document.querySelector('.explain');
    document.getElementById('explain-code').textContent = btn.textContent.trim() === '—' ? 'CABIN' : btn.textContent.trim();
    document.getElementById('explain-title').textContent = title;
    document.getElementById('explain-body').textContent = body;
    box.classList.toggle('is-missing', btn.classList.contains('missing'));
  }

  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang, true)));
  document.querySelectorAll('.code-btn').forEach((b) => b.addEventListener('click', () => showField(b.dataset.field)));

  // Header border once the page scrolls.
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // One scan pass over the ticket when the page opens.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) requestAnimationFrame(() => document.querySelector('.decoder').classList.add('scanning'));

  // Launch form: inline validation, then Netlify Forms handles the submission.
  const form = document.querySelector('.notify');
  const email = document.getElementById('email');
  const err = document.getElementById('email-error');
  form.addEventListener('submit', (e) => {
    if (!email.checkValidity()) {
      e.preventDefault();
      err.hidden = false;
      email.setAttribute('aria-invalid', 'true');
      email.setAttribute('aria-describedby', 'email-error');
      email.focus();
    }
  });
  email.addEventListener('input', () => {
    if (email.checkValidity()) { err.hidden = true; email.removeAttribute('aria-invalid'); }
  });

  let saved = null;
  try { saved = localStorage.getItem('safarcare-lang'); } catch (e) { /* storage off */ }
  const fromHash = location.hash.replace('#', '');
  const browser = (navigator.language || 'en').slice(0, 2);
  setLang(T[fromHash] ? fromHash : saved || (T[browser] ? browser : 'en'), false);
})();
