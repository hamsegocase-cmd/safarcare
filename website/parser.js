// SafarCare ticket reader: finds airports, flights, dates, names, booking references and baggage in ticket text.
// Runs entirely in the browser. Nothing is guessed: anything not found stays empty.
// Prototype of the SafarCare ticket parser, used only to test the regexes
// and the assembly logic here. The app's real parser is the Dart port.
const AIRPORTS = {
  HGA:'Hargeisa',BBO:'Berbera',BSA:'Bosaso',MGQ:'Mogadishu',GLK:'Galkayo',KMU:'Kismayo',BUO:'Burao',GGR:'Garowe',
  JIB:'Djibouti',ADD:'Addis Ababa',DIR:'Dire Dawa',JIJ:'Jijiga',NBO:'Nairobi',MBA:'Mombasa',EBB:'Entebbe',
  DAR:'Dar es Salaam',JRO:'Kilimanjaro',ZNZ:'Zanzibar',KGL:'Kigali',KRT:'Khartoum',PZU:'Port Sudan',ASM:'Asmara',
  CAI:'Cairo',HBE:'Alexandria',JNB:'Johannesburg',CPT:'Cape Town',LOS:'Lagos',ACC:'Accra',
  DXB:'Dubai',DWC:'Dubai World Central',SHJ:'Sharjah',AUH:'Abu Dhabi',DOH:'Doha',BAH:'Bahrain',KWI:'Kuwait',
  MCT:'Muscat',SLL:'Salalah',RUH:'Riyadh',JED:'Jeddah',MED:'Madinah',DMM:'Dammam',AMM:'Amman',BEY:'Beirut',
  IST:'Istanbul',SAW:'Istanbul Sabiha Gokcen',ESB:'Ankara',ADE:'Aden',SAH:'Sanaa',
  BOM:'Mumbai',DEL:'Delhi',BLR:'Bengaluru',KHI:'Karachi',ISB:'Islamabad',LHE:'Lahore',CMB:'Colombo',MLE:'Male',
  KUL:'Kuala Lumpur',SIN:'Singapore',BKK:'Bangkok',CGK:'Jakarta',CAN:'Guangzhou',PEK:'Beijing',PKX:'Beijing Daxing',HKG:'Hong Kong',
  LHR:'London Heathrow',LGW:'London Gatwick',STN:'London Stansted',MAN:'Manchester',BHX:'Birmingham',
  CDG:'Paris',AMS:'Amsterdam',FRA:'Frankfurt',MUC:'Munich',BRU:'Brussels',ZRH:'Zurich',GVA:'Geneva',VIE:'Vienna',
  CPH:'Copenhagen',ARN:'Stockholm',GOT:'Gothenburg',OSL:'Oslo',HEL:'Helsinki',FCO:'Rome',MXP:'Milan',MAD:'Madrid',
  BCN:'Barcelona',LIS:'Lisbon',ATH:'Athens',DUB:'Dublin',
  JFK:'New York JFK',EWR:'Newark',IAD:'Washington Dulles',ORD:'Chicago',MSP:'Minneapolis',ATL:'Atlanta',IAH:'Houston',
  DFW:'Dallas',LAX:'Los Angeles',SEA:'Seattle',SFO:'San Francisco',BOS:'Boston',CMH:'Columbus',
  YYZ:'Toronto',YUL:'Montreal',YOW:'Ottawa',YVR:'Vancouver',YEG:'Edmonton',YYC:'Calgary',
  TUN:'Tunis',ALG:'Algiers',CMN:'Casablanca',
};
// Codes that are also common words/abbreviations: need extra context.
const AMBIGUOUS = new Set(['ADD','CAN','MAN','LOS','SIN','MAD','DEL','MED','ACC','EBB','SEA','LAX','ORD','ATH','BOM','DIR','MBA','TUN','DUB','BOS','CAI','AMS','FRA','SAW','GOT','DAR','BAH','ARN','HEL']);
const AIRLINES = {
  ET:'Ethiopian Airlines',FZ:'flydubai',EK:'Emirates',QR:'Qatar Airways',TK:'Turkish Airlines',KQ:'Kenya Airways',
  WY:'Oman Air',J9:'Jazeera Airways',SV:'Saudia',MS:'EgyptAir',XY:'flynas',G9:'Air Arabia',D3:'Daallo Airlines',
  '3J':'Jubba Airways',XU:'African Express Airways',EY:'Etihad Airways',GF:'Gulf Air',KU:'Kuwait Airways',
  RJ:'Royal Jordanian',ME:'Middle East Airlines',PC:'Pegasus Airlines',WB:'RwandAir',TC:'Air Tanzania',
  UR:'Uganda Airlines',KP:'ASKY Airlines',AT:'Royal Air Maroc',
  BA:'British Airways',LH:'Lufthansa',AF:'Air France',KL:'KLM',SN:'Brussels Airlines',LX:'SWISS',OS:'Austrian Airlines',
  SK:'SAS',AY:'Finnair',AZ:'ITA Airways',IB:'Iberia',TP:'TAP Air Portugal',A3:'Aegean Airlines',EI:'Aer Lingus',
  AA:'American Airlines',UA:'United Airlines',DL:'Delta Air Lines',AC:'Air Canada',
  AI:'Air India','6E':'IndiGo',PK:'Pakistan International Airlines',UL:'SriLankan Airlines',MH:'Malaysia Airlines',
  SQ:'Singapore Airlines',TG:'Thai Airways',GA:'Garuda Indonesia',CZ:'China Southern',CA:'Air China',CX:'Cathay Pacific',
  IY:'Yemenia',SM:'Air Cairo',NE:'Nesma Airlines',F3:'flyadeal',OV:'SalamAir',
};
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function norm(text){
  return text.toUpperCase().replace(/[–—]/g,'-').replace(/→/g,' - ').replace(/[ \t]+/g,' ');
}

const TIME_RE = /(?<![\d./])\b([01]?\d|2[0-3])[:.H]([0-5]\d)(?![./]\d)\s?(AM|PM)?\b/g;

function findAirports(text){
  const out=[];
  const lines=text.split('\n'); let offset=0;
  for(const line of lines){
    const hasTime=/\b([01]?\d|2[0-3]):[0-5]\d\b/.test(line);
    const strong=[]; // unambiguous codes or bracketed codes in this line
    const cands=[];
    // City pairs like HGAADD
    for(const m of line.matchAll(/\b([A-Z]{3})([A-Z]{3})\b/g)){
      if(AIRPORTS[m[1]]&&AIRPORTS[m[2]]&&m[1]!==m[2]){cands.push({code:m[1],pos:offset+m.index,ok:true});cands.push({code:m[2],pos:offset+m.index+3,ok:true});}
    }
    for(const m of line.matchAll(/\b([A-Z]{3})\b/g)){
      const code=m[1]; if(!AIRPORTS[code]) continue;
      const before=line[m.index-1], after=line[m.index+3];
      const bracketed=before==='('&&after===')';
      const city=AIRPORTS[code].toUpperCase();
      const cityNear=line.includes(city.split(' ')[0]);
      cands.push({code,pos:offset+m.index,bracketed,cityNear,ok:!AMBIGUOUS.has(code)||bracketed||cityNear});
    }
    const okCount=cands.filter(c=>c.ok).length;
    for(const c of cands){
      // An ambiguous code is accepted if the same line also has another
      // accepted airport, or a clock time (itinerary line).
      if(c.ok || okCount>=1&&cands.length>=2 || hasTime&&cands.length>=2) out.push({code:c.code,pos:c.pos});
    }
    offset+=line.length+1;
  }
  out.sort((a,b)=>a.pos-b.pos);
  return out;
}

function findFlights(text){
  const out=[];
  const re=/\b([A-Z]{2}|[A-Z]\d|\d[A-Z])\s?-?\s?(\d{1,4})(?![\d:.]|\s?KG|\s?PC)\b/g;
  for(const m of text.matchAll(re)){
    const code=m[1];
    const known=!!AIRLINES[code];
    const ctx=text.slice(Math.max(0,m.index-25),m.index);
    const flightWord=/FLIGHT|FLT|VOL|RIHLA/.test(ctx);
    if(!known&&!flightWord) continue;
    if(/^\d+$/.test(code)) continue;
    out.push({code,number:m[2],pos:m.index,flight:code+' '+String(parseInt(m[2],10))});
  }
  return out;
}

function inferYear(day,month,now){
  let y=now.getFullYear();
  const d=new Date(y,month,day);
  if(d < new Date(now.getFullYear(),now.getMonth(),now.getDate()-60)) y+=1;
  return y;
}

function findDates(text,now){
  const out=[];
  const mon='(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]*\\.?';
  const add=(pos,len,y,mo,d)=>{ if(mo<0||mo>11||d<1||d>31) return; if(y<2000||y>2100) return; out.push({pos,len,y,mo,d}); };
  // 19NOV26, 19 NOV 2026, 19 November 2026, THU 19NOV
  for(const m of text.matchAll(new RegExp('\\b(\\d{1,2})\\s?-?'+mon+'\\s?-?,?\\s?(\\d{4}|\\d{2}(?![:\\d]))?','g'))){
    const d=+m[1], mo=MONTHS.indexOf(m[2]);
    let y=m[3]?+m[3]:null; if(y!==null&&y<100) y+=2000; if(y===null) y=inferYear(d,mo,now);
    add(m.index,m[0].length,y,mo,d);
  }
  // Nov 19, 2026
  for(const m of text.matchAll(new RegExp('\\b'+mon+'\\s(\\d{1,2}),?\\s(\\d{4})\\b','g'))){
    add(m.index,m[0].length,+m[3],MONTHS.indexOf(m[1]),+m[2]);
  }
  // 2026-11-19
  for(const m of text.matchAll(/\b(20\d{2})-(\d{2})-(\d{2})\b/g)) add(m.index,m[0].length,+m[1],+m[2]-1,+m[3]);
  // 19/11/2026 (day first)
  for(const m of text.matchAll(/\b(\d{1,2})[\/.](\d{1,2})[\/.](20\d{2}|\d{2})\b/g)){
    let y=+m[3]; if(y<100) y+=2000; add(m.index,m[0].length,y,+m[2]-1,+m[1]);
  }
  // drop overlaps (keep longest earliest)
  out.sort((a,b)=>a.pos-b.pos||b.len-a.len);
  const res=[]; let end=-1;
  for(const d of out){ if(d.pos>=end){res.push(d); end=d.pos+d.len;} }
  return res;
}

function findTimes(text){
  const out=[];
  for(const m of text.matchAll(TIME_RE)){
    let h=+m[1]; const mi=+m[2];
    if(m[3]==='PM'&&h<12) h+=12; if(m[3]==='AM'&&h===12) h=0;
    out.push({pos:m.index,h,mi});
  }
  // GDS style 4-digit times on lines with a city pair: "HGAADD HK1 1430 1630"
  const lines=text.split('\n'); let off=0;
  for(const line of lines){
    if(/\b[A-Z]{6}\b/.test(line) && [...line.matchAll(/\b([A-Z]{3})([A-Z]{3})\b/g)].some(m=>AIRPORTS[m[1]]&&AIRPORTS[m[2]])){
      for(const m of line.matchAll(/\b([01]\d|2[0-3])([0-5]\d)(?:\+1)?\b/g)) out.push({pos:off+m.index,h:+m[1],mi:+m[2]});
    }
    off+=line.length+1;
  }
  return out.sort((a,b)=>a.pos-b.pos);
}

function between(list,start,end){return list.filter(x=>x.pos>=start&&x.pos<end);}

function buildSegments(text,now){
  const airports=findAirports(text), flights=findFlights(text), dates=findDates(text,now), times=findTimes(text);
  const segs=[];
  const mkDT=(regionDates,regionTimes,lastDate)=>{
    const res=[];
    let curDate=lastDate;
    const events=[...regionDates.map(d=>({...d,t:'d'})),...regionTimes.map(t=>({...t,t:'t'}))].sort((a,b)=>a.pos-b.pos);
    for(const e of events){
      if(e.t==='d'){curDate=e;}
      else if(curDate){
        let dt=new Date(curDate.y,curDate.mo,curDate.d,e.h,e.mi);
        // A time-only arrival earlier than the departure on the same date is the next day.
        const prev=res[res.length-1];
        if(prev&&prev.dateRef===curDate&&dt<=prev) dt=new Date(dt.getTime()+86400000);
        dt.dateRef=curDate; res.push(dt);
      }
    }
    // a date with no time is still useful (date only)
    if(res.length===0&&regionDates.length) res.push(new Date(regionDates[0].y,regionDates[0].mo,regionDates[0].d));
    return {dts:res,lastDate:curDate};
  };
  const uniqFlights=[];
  for(const f of flights){ if(!uniqFlights.some(u=>u.flight===f.flight)) uniqFlights.push(f); }
  if(uniqFlights.length){
    let lastDate=null;
    const used=new Set();
    const lineStart=(pos)=>{ const a=text.lastIndexOf('\n',pos-1); const b=a<0?0:text.lastIndexOf('\n',a-1); return i=>i; };
    for(let i=0;i<uniqFlights.length;i++){
      const f=uniqFlights[i];
      // Region: from the start of the line before the flight number
      // (route lines often sit just above), to the next different flight.
      const prevNl=text.lastIndexOf('\n',f.pos-1);
      const prevLineStart=prevNl<0?0:text.lastIndexOf('\n',prevNl-1)+1;
      const nextPos = flights.find(x=>x.pos>f.pos&&x.flight!==f.flight)?.pos ?? text.length;
      const end=nextPos;
      const linesBack=(n)=>{ let p=f.pos; for(let k=0;k<=n;k++){ const nl=text.lastIndexOf('\n',p-1); if(nl<0) return 0; p=nl; } return p+1; };
      const pick=(start)=>{ const res=[]; for(const a of between(airports,start,end).filter(x=>!used.has(x.pos))){ if(!res.length||res[res.length-1].code!==a.code) res.push(a); if(res.length===2) break; } return res; };
      let start=linesBack(1);
      let picked=pick(start);
      if(picked.length<2){ start=linesBack(3); picked=pick(start); }
      const free=(list)=>between(list,start,end).filter(x=>!used.has(x.pos));
      const rd=free(dates), rt=free(times);
      const {dts,lastDate:ld}=mkDT(rd,rt,lastDate); lastDate=ld;
      if(picked.length===2){
        picked.forEach(a=>used.add(a.pos));
        [...rd,...rt].filter(x=>x.pos>=Math.min(f.pos,picked[0].pos)).forEach(x=>used.add(x.pos));
        segs.push({from:picked[0].code,to:picked[1].code,flight:f.flight,dep:dts[0]||null,arr:(dts[1]&&dts[0]&&dts[1]>dts[0])?dts[1]:null});
      }
    }
  }
  if(!segs.length){
    const seq=[];
    for(const a of airports){ if(seq[seq.length-1]!==a.code) seq.push(a.code); }
    const {dts}=mkDT(dates,times,null);
    for(let i=0;i+1<seq.length;i++) segs.push({from:seq[i],to:seq[i+1],flight:null,dep:dts[i]||null,arr:null});
  }
  // chain sanity: drop a segment that duplicates another
  return segs.filter((s,i)=>!segs.slice(0,i).some(p=>p.from===s.from&&p.to===s.to&&p.flight===s.flight));
}

function findPassenger(text){
  let m=text.match(/\b([A-Z][A-Z'-]{1,})\/([A-Z][A-Z'-]+(?: (?!(?:MR|MRS|MS|MISS|MSTR|DR|CHD|INF)\b)[A-Z][A-Z'-]+)*)(?:\s?(MR|MRS|MS|MISS|MSTR|DR|CHD|INF))?\b/);
  if(m) return (m[2]+' '+m[1]).replace(/\s+/g,' ').trim();
  m=text.match(/\b(?:PASSENGER(?:\s?NAME)?|TRAVELL?ER(?:\s?NAME)?|NAME OF PASSENGER)\s*[:\-]?\s*(?:\n\s*)?(?:(?:MR|MRS|MS|MISS|DR)\.?\s)?([A-Z][A-Z'-]+(?: [A-Z][A-Z'-]+){1,3})\b/);
  if(m&&!/^(DETAILS|INFORMATION|TYPE|ADULT)/.test(m[1])) return m[1].replace(/\s(MR|MRS|MS|MISS)$/,'').trim();
  m=text.match(/^\s*(?:MR|MRS|MS|MISS|MSTR|DR)\.?\s([A-Z][A-Z'-]+(?: [A-Z][A-Z'-]+){1,3})\s*$/m);
  if(m) return m[1];
  return null;
}

function findBookingRef(text){
  const re=/\b(?:BOOKING\s?(?:REF(?:ERENCE)?|CODE|NUMBER|ID)|PNR|RECORD\s?LOCATOR|RESERVATION\s?(?:CODE|NUMBER|REF(?:ERENCE)?)|CONFIRMATION\s?(?:CODE|NUMBER)|AIRLINE\s?(?:REF(?:ERENCE)?|BOOKING\s?REF(?:ERENCE)?))\.?\s?(?:NO\.?|#)?\s?[:\-]?\s*(?:\n\s*)?([A-Z0-9]{5,8})\b/g;
  for(const m of text.matchAll(re)){
    const v=m[1];
    if(/[A-Z]/.test(v)&&/^[A-Z0-9]+$/.test(v)&&!['NUMBER','CODE','STATUS','DETAILS','ISSUED'].includes(v)) return v;
  }
  return null;
}

function findClass(text){
  const m=text.match(/\b(PREMIUM ECONOMY|ECONOMY|BUSINESS|FIRST)(?:\s?CLASS)?\b/);
  return m?m[1].charAt(0)+m[1].slice(1).toLowerCase():null;
}
function findFare(text){
  let m=text.match(/\bFARE\s?(?:TYPE|FAMILY|BRAND)\s*[:\-]?\s*([A-Z][A-Z ]{2,20}?)\s*(?:\n|$|  )/);
  if(m) return m[1].trim();
  m=text.match(/\bFARE\s?BASIS\s*[:\-]?\s*([A-Z0-9]{3,10})\b/);
  return m?m[1]:null;
}
function findTerminal(text){const m=text.match(/\bTERMINAL\s*[:\-]?\s*([A-Z0-9]{1,3})\b/);return m?m[1]:null;}
function findGate(text){const m=text.match(/\bGATE\s*[:\-]?\s*([A-Z]?\d{1,3}[A-Z]?)\b/);return m?m[1]:null;}

// ---------- baggage ----------
const CABIN_WORDS=/CABIN|HAND\s?(?:BAG|LUGGAGE|BAGGAGE)|CARRY[\s-]?ON|PERSONAL ITEM|HAND$/;
const CHECKED_WORDS=/CHECKED|CHECK[\s-]?IN BAG|HOLD|FREE BAG|BAGGAGE|LUGGAGE|BAG ALLOWANCE|\bBAGS?\b/;
const SALES_WORDS=/EXTRA|EXCESS|ADDITIONAL|PURCHASE|\bBUY\b|\bFEE|USD|\$|ETB|AED|EUR|PER KG|PRE-?PAID|UPGRADE/;

function findBaggage(text){
  const lines=text.split('\n');
  const checked=[], cabin=[];
  for(let li=0;li<lines.length;li++){
    const line=lines[li];
    if(SALES_WORDS.test(line)) continue;
    const toks=[];
    const taken=[];
    const push=(m,a)=>{ taken.push([m.index,m.index+m[0].length]); toks.push({...a,raw:m[0].trim(),idx:m.index}); };
    for(const m of line.matchAll(/\b(\d{1,2})\s?[X×*]\s?(\d{1,2})\s?KGS?\b/g)) push(m,{pieces:+m[1],kgPerPiece:+m[2]});
    for(const m of line.matchAll(/\b(\d{1,2})\s?(?:PCS?|PIECES?)\b(?:\s?(?:OF|X|@|,|\/)?\s?(?:UP TO|MAX\.?|MAX)?\s?(\d{1,2})\s?KGS?\b)?/g)){
      if(taken.some(([s,e])=>m.index>=s&&m.index<e)) continue;
      push(m,{pieces:+m[1],kgPerPiece:m[2]?+m[2]:null});
    }
    for(const m of line.matchAll(/\b(\d{1,3})\s?KGS?\b/g)){
      if(taken.some(([s,e])=>m.index>=s&&m.index<e)) continue;
      push(m,{totalKg:+m[1]});
    }
    for(const m of line.matchAll(/\b(NIL|NO)\s(?:CHECKED\s)?BAG(?:GAGE)?S?\b/g)) push(m,{pieces:0});
    for(const t of toks){
      const ctx=(lines[li-1]&&!/\d/.test(lines[li-1])?lines[li-1]+' ':'')+line.slice(0,t.idx);
      const after=line.slice(t.idx+t.raw.length);
      let kind=null;
      if(CABIN_WORDS.test(ctx)) kind='cabin';
      else if(CHECKED_WORDS.test(ctx)) kind='checked';
      else if(CABIN_WORDS.test(after)) kind='cabin';
      else if(/^\s?(CHECKED|CHECK[\s-]?IN)/.test(after)) kind='checked';
      // A cabin word earlier on the line followed by "checked" closer to the token
      const li2=(re)=>{let r=-1;for(const m of ctx.matchAll(re)) r=m.index;return r;}; const lastCabin=li2(/CABIN|HAND|CARRY/g), lastChecked=li2(/CHECKED|CHECK[\s-]?IN|HOLD/g);
      if(lastCabin>=0&&lastChecked>lastCabin) kind='checked';
      if(lastChecked>=0&&lastCabin>lastChecked) kind='cabin';
      if(kind==='cabin') cabin.push(t); else if(kind==='checked') checked.push(t);
    }
  }
  return {checked:merge(checked),cabin:merge(cabin)};
}
function compatible(a,b){
  const k=['pieces','kgPerPiece','totalKg'];
  return k.every(x=>a[x]==null||b[x]==null||a[x]===b[x]);
}
function merge(list){
  if(!list.length) return {status:'notFound'};
  let acc={pieces:null,kgPerPiece:null,totalKg:null,raw:[]};
  for(const t of list){
    if(!compatible(acc,t)) return {status:'conflict',raw:list.map(x=>x.raw)};
    for(const k of ['pieces','kgPerPiece','totalKg']) if(t[k]!=null) acc[k]=t[k];
    if(!acc.raw.includes(t.raw)) acc.raw.push(t.raw);
  }
  // "2PC" + "23KG" seen separately: 23 is per piece, not total
  if(acc.pieces!=null&&acc.totalKg!=null&&acc.kgPerPiece==null){acc.kgPerPiece=acc.totalKg;acc.totalKg=null;}
  return {status:'found',...acc};
}

function parse(raw,now=new Date()){
  const text=norm(raw);
  const segs=buildSegments(text,now);
  const firstFlight=findFlights(text)[0];
  return {
    terminalFirst:findTerminal(text),
    passenger:findPassenger(text),
    airline: firstFlight? AIRLINES[firstFlight.code]||null : null,
    bookingRef:findBookingRef(text),
    cls:findClass(text), fare:findFare(text),
    terminal:findTerminal(text), gate:findGate(text),
    segments:segs,
    baggage:findBaggage(text),
  };
}

