(()=>{
'use strict';
const $ = (id) => document.getElementById(id);
const money = new Intl.NumberFormat('es-VE',{style:'currency', currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2});
const number = new Intl.NumberFormat('es-VE',{maximumFractionDigits:2});
const TROY_OZ_GRAMS = 31.1034768;
const JEWELERS = [
  {name:'Joyería Aurora',area:'Las Mercedes · ubicación ilustrativa',rating:'4,9',reviews:82,percent:.70, desc:'Atención personalizada y explicación de cada paso.',tag:'Mayor referencia'},
  {name:'Joyería Lúmina',area:'Altamira · ubicación ilustrativa',rating:'4,8',reviews:64,percent:.68,desc:'Un proceso tranquilo, transparente y a tu ritmo.',tag:'A tu ritmo'},
  {name:'Joyería Brillo',area:'Chacao · ubicación ilustrativa',rating:'4,7',reviews:106,percent:.66,desc:'Especialistas en revisión presencial de joyas.',tag:'Atención cercana'}
];
const names = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
let selected=new Set(['Anillos']), spot=null, result=null, shop=0, displayMonth=null, selectedDay='', selectedTime='';
const menuToggle=$('menuToggle'), menu=$('mobileNav');
if(menuToggle && menu){menuToggle.addEventListener('click',()=>{const isOpen=menuToggle.getAttribute('aria-expanded')==='true';menuToggle.setAttribute('aria-expanded',String(!isOpen));menuToggle.setAttribute('aria-label',isOpen?'Abrir menú':'Cerrar menú');menu.hidden=isOpen;});menu.querySelectorAll('a').forEach(el=>el.addEventListener('click',()=>{menu.hidden=true;menuToggle.setAttribute('aria-expanded','false');}));}
function setStep(i){const first=$('valuationFirstStep'),second=$('valuationSecondStep');first.hidden=i!==1;second.hidden=i!==2;document.querySelector('.step-number').innerHTML=`0${i} <span>/ 02</span>`;$('stepProgress').style.width=i===1?'50%':'100%';document.querySelector('.step-progress-label').textContent=i===1?'Conoce tus piezas':'Descubre tus opciones';$('valuationCard').scrollIntoView({behavior:'smooth',block:'start'});}
document.querySelectorAll('[data-piece]').forEach(chip=>chip.addEventListener('click',()=>{const name=chip.dataset.piece;selected.has(name)?selected.delete(name):selected.add(name);document.querySelectorAll('[data-piece]').forEach(el=>{const active=selected.has(el.dataset.piece);el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});}));
async function loadSpot(){
  $('spotStatus').textContent='Consultando cotización del oro…';$('retrySpot').hidden=true;$('marketFeed').classList.remove('rate-error');
  try{
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),9000);
    let response;try{response=await fetch('https://api.gold-api.com/price/XAU',{cache:'no-store',signal:controller.signal});}finally{clearTimeout(timeout);}
    if(!response.ok)throw new Error('Cotización no disponible');
    const data=await response.json();
    const price=Number(data.price);if(data.symbol!=='XAU'||data.currency!=='USD'||!Number.isFinite(price)||price<=0)throw new Error('Datos de cotización no válidos');
    const stamp=new Date(data.updatedAt||'');
    if(!Number.isFinite(stamp.valueOf()))throw new Error('Cotización sin fecha verificable');
    const age=Date.now()-stamp.valueOf(); if(age>48*3600000)throw new Error('Cotización demasiado antigua');
    spot={price, timestamp:stamp};
    $('spotStatus').textContent=`Oro 24K · ${money.format(price/TROY_OZ_GRAMS)}/g · actualizado ${stamp.toLocaleString('es-VE',{dateStyle:'medium',timeStyle:'short'})}`;
  }catch(error){spot=null;$('marketFeed').classList.add('rate-error');$('spotStatus').textContent='No se pudo consultar el precio del oro ahora. Reintenta para calcular una referencia actual.';$('retrySpot').hidden=false;}
  updateResult();
}
$('retrySpot')?.addEventListener('click',loadSpot);
function updateResult(){
  if(!result)return;
  const canCalculate=result.weight>0 && result.karat>0;
  $('missingInfo').hidden=canCalculate;$('calculatedResult').hidden=!canCalculate||!spot;
  if(!canCalculate)return;
  if(!spot)return;
  const pure=result.weight*result.karat/24;
  const gross=pure*spot.price/TROY_OZ_GRAMS;
  const purchase=gross*.7;
  $('pureWeight').textContent=`${number.format(pure)} g`;
  
  $('offerAmount').textContent=money.format(purchase);
  $('calcWeight').textContent=`${number.format(result.weight)} g`;
  $('calcPurity').textContent=`${result.karat}K / ${number.format(result.karat/24*100)}%`; $('displayPurity').textContent=`${result.karat}K`;

  const grid=$('offersGrid');grid.replaceChildren();
  JEWELERS.forEach((j,index)=>{
    const card=document.createElement('article');card.className='offer-card';
    card.innerHTML=`<div class="offer-card-top"><span class="shop-monogram" aria-hidden="true">${j.name.replace(/^Joyería /,"").slice(0,1)}</span><span class="offer-tag">${j.tag}</span></div><h4>${j.name}</h4><p class="shop-area">${j.area}</p><p class="shop-review"><span aria-hidden="true">★★★★★</span> ${j.rating} <small>(${j.reviews} opiniones ilustrativas)</small></p><p class="shop-description">${j.desc}</p><div class="shop-amount"><small>Precio estimado de compra</small><strong>${money.format(gross*j.percent)}</strong></div><button type="button" class="button button-outline shop-book" data-shop="${index}">Elegir y ver citas <span aria-hidden="true">↗</span></button>`;
    grid.appendChild(card);
  });
  grid.querySelectorAll('[data-shop]').forEach(btn=>btn.addEventListener('click',()=>{chooseShop(Number(btn.dataset.shop));$('cita').scrollIntoView({behavior:'smooth',block:'start'});}));
}
$('valuationForm')?.addEventListener('submit',(e)=>{
  e.preventDefault();const w=$('weight').value.trim();const weight=w===''?null:Number(w);const pureStr=$('purity').value;const karat=pureStr?parseInt(pureStr,10):null;
  if(w!==''&&(!Number.isFinite(weight)||weight<=0||weight>100000)){$('weight').setCustomValidity('Introduce un peso válido superior a cero.');$('weight').reportValidity();return;}
  $('weight').setCustomValidity('');
  result={weight,karat};$('resultPieces').textContent=selected.size?Array.from(selected).join(', ').toLowerCase():'piezas de oro';$('resultExtras').textContent=`${weight?' · '+number.format(weight)+' g':''}${karat?' · '+karat+'K':''}`;
  setStep(2);updateResult();if(!spot)loadSpot();
});
$('weight')?.addEventListener('input',()=>$('weight').setCustomValidity(''));
$('startOver')?.addEventListener('click',()=>setStep(1));
$('completeDetails')?.addEventListener('click',()=>{setStep(1);$('weight').focus({preventScroll:true});});
function today(){const d=new Date();d.setHours(0,0,0,0);return d;}
function dateKey(d){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
function keyDate(key){const [y,m,d]=key.split('-').map(Number);return new Date(y,m-1,d);}
function dateLabel(key){return keyDate(key).toLocaleDateString('es-VE',{weekday:'long',day:'numeric',month:'long',year:'numeric'});}
function chooseShop(index){shop=index;$('shopSelect').value=String(index);selectedDay='';selectedTime='';$('bookingFeedback').hidden=true;renderCalendar();}
function renderCalendar(){
 if(!displayMonth)displayMonth=new Date(today().getFullYear(),today().getMonth(),1);
 const y=displayMonth.getFullYear(),m=displayMonth.getMonth();$('monthLabel').textContent=names[m].charAt(0).toUpperCase()+names[m].slice(1)+' '+y;
 const first=new Date(y,m,1),last=new Date(y,m+1,0);const from=(first.getDay()+6)%7;
 const grid=$('calendarGrid');grid.replaceChildren();
 ['L','M','X','J','V','S','D'].forEach(t=>{const e=document.createElement('span');e.className='week-label';e.textContent=t;grid.appendChild(e);});
 for(let k=0;k<from;k++){const blank=document.createElement('span');blank.className='calendar-empty';grid.appendChild(blank);}
 const min=today(),max=new Date(min);max.setDate(min.getDate()+60);
 for(let day=1;day<=last.getDate();day++){
  const d=new Date(y,m,day),weekday=d.getDay();const enabled=d>=min&&d<=max&&weekday!==0;
  const b=document.createElement('button');b.type='button';b.textContent=String(day);b.className='calendar-day';b.disabled=!enabled;b.setAttribute('aria-label',d.toLocaleDateString('es-VE',{weekday:'long',day:'numeric',month:'long'}));if(enabled&&dateKey(d)===selectedDay)b.classList.add('selected');
  if(enabled)b.addEventListener('click',()=>{selectedDay=dateKey(d);selectedTime='';$('bookingFeedback').hidden=true;renderCalendar();});grid.appendChild(b);
 }
 const maxM=new Date(min.getFullYear(),min.getMonth()+2,1);
 $('prevMonth').disabled=displayMonth<=new Date(min.getFullYear(),min.getMonth(),1);
 $('nextMonth').disabled=displayMonth>=maxM;
 renderTimes();
}
function renderTimes(){
 const wrap=$('timeOptions');wrap.replaceChildren();if(!selectedDay){const p=document.createElement('p');p.textContent='Selecciona una fecha para ver los horarios.';wrap.appendChild(p);}
 else {const day=keyDate(selectedDay).getDay();const times=day===6?['09:30','11:00','12:30']:['10:00','11:30','15:00','16:30'];
 times.forEach(t=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.className='time-slot'+(t===selectedTime?' selected':'');b.setAttribute('aria-pressed',String(t===selectedTime));b.addEventListener('click',()=>{selectedTime=t;$('bookingFeedback').hidden=true;renderTimes();});wrap.appendChild(b);});}
 $('confirmBooking').disabled=!(selectedDay&&selectedTime);
 $('bookingSummary').textContent=selectedDay&&selectedTime?`${JEWELERS[shop].name} · ${dateLabel(selectedDay)} · ${selectedTime}`:'Elige día y hora para continuar.';
}
$('prevMonth')?.addEventListener('click',()=>{displayMonth.setMonth(displayMonth.getMonth()-1);renderCalendar();});
$('nextMonth')?.addEventListener('click',()=>{displayMonth.setMonth(displayMonth.getMonth()+1);renderCalendar();});
$('shopSelect')?.addEventListener('change',e=>chooseShop(Number(e.target.value)));
$('confirmBooking')?.addEventListener('click',()=>{if(!selectedDay||!selectedTime)return;const f=$('bookingFeedback');f.hidden=false;f.innerHTML='<strong>¡Tu elección está preparada!</strong><p>Has seleccionado <b>'+JEWELERS[shop].name+'</b>, '+dateLabel(selectedDay)+' a las '+selectedTime+'. Este ejemplo no registra ni confirma una cita; la reserva se realizará cuando el establecimiento esté conectado.</p>';f.scrollIntoView({behavior:'smooth',block:'nearest'});});
$('year').textContent=String(new Date().getFullYear());displayMonth=new Date(today().getFullYear(),today().getMonth(),1);renderCalendar();loadSpot();
})();