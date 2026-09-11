const services = [
  {name:'Комбинированная чистка', price:'4 500 ₽', desc:'Глубокое очищение с ультразвуком и завершающим уходом · 60–90 минут'},
  {name:'Восстановление микробиома', price:'4 000 ₽', desc:'Барьер, увлажнение и комфорт чувствительной кожи.'},
  {name:'Жёлтый пилинг', price:'4 500 ₽', desc:'Осветление, ровный тон и сияние.'},
  {name:'TCA-пилинг', price:'5 500 ₽', desc:'Постакне, рельеф и пигментация.'},
  {name:'Озонотерапия', price:'3 500 ₽', desc:'Дополнительный уход, свежесть и комфорт кожи.'},
  {name:'Чистка + озонотерапия', price:'6 500 ₽', desc:'Комплексное очищение и дополнительный уход за кожей.'},
  {name:'Домашний уход', price:'0 ₽', desc:'Анализ состояния кожи и подбор индивидуальной схемы.'}
];

let state = {step:1, service:0, date:25, time:'10:00'};

const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
menuBtn.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-hidden', !open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

const serviceWrap = document.getElementById('service-options');
function drawServices(){
  serviceWrap.innerHTML = services.map((s,i)=>`
    <button class="service-option ${i===state.service?'active':''}" data-i="${i}">
      <strong>✦ ${s.name}</strong><span>${s.price}</span><small>${s.desc}</small>
    </button>`).join('');
  serviceWrap.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    state.service=+b.dataset.i; drawServices();
  });
}
drawServices();

const cal = document.getElementById('calendar');
function drawCalendar(){
  const blanks = 1; // Sep 1, 2026 is Tuesday in Monday-first grid
  let html='';
  for(let i=0;i<blanks;i++) html += '<span></span>';
  for(let d=1;d<=30;d++){
    const muted=d<12;
    html += `<button type="button" class="${muted?'muted ':''}${d===12?'today ':''}${d===state.date?'active':''}" data-day="${d}">${d}</button>`;
  }
  cal.innerHTML=html;
  cal.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    if(b.classList.contains('muted')) return;
    state.date=+b.dataset.day; drawCalendar();
  })
}
drawCalendar();

const slotTimes=['10:00','11:00','12:30','14:00','15:30','17:00','18:30'];
const slots=document.getElementById('slots');
function drawSlots(){
  slots.innerHTML=slotTimes.map(t=>`<button type="button" class="${t===state.time?'active':''}" data-time="${t}">${t}</button>`).join('');
  slots.querySelectorAll('button').forEach(b=>b.onclick=()=>{state.time=b.dataset.time;drawSlots()});
}
drawSlots();

function go(step){
  state.step=step;
  document.querySelectorAll('.book-step').forEach(el=>el.classList.toggle('active',+el.dataset.step===step));
  document.querySelectorAll('.progress span').forEach((el,i)=>el.classList.toggle('active',i+1===Math.min(step,3)));
  document.getElementById('booking').scrollIntoView({behavior:'smooth',block:'start'});
}
document.querySelectorAll('.next-step').forEach(btn=>btn.onclick=()=>go(Math.min(state.step+1,3)));
document.querySelectorAll('.back-step').forEach(btn=>btn.onclick=()=>go(Math.max(state.step-1,1)));

document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>{
  const idx=services.findIndex(s=>s.name===a.dataset.service);
  if(idx>=0){state.service=idx;drawServices();}
}));

document.querySelector('.confirm').onclick=()=>{
  const name=document.getElementById('name').value.trim() || 'Гость';
  const phone=document.getElementById('phone').value.trim() || 'не указан';
  const s=services[state.service];
  const payload={name,phone,service:s.name,price:s.price,date:`${state.date} сентября 2026`,time:state.time};
  localStorage.setItem('jafarova-demo-booking',JSON.stringify(payload));
  document.getElementById('summary').innerHTML=`
    <strong>${payload.service}</strong><br>
    ${payload.date} · ${payload.time}<br>
    ${payload.price}<br><br>
    ${payload.name}<br>${payload.phone}<br><br>
    <small>Демо-запись сохранена только в этом браузере.</small>`;
  go(4);
};
document.querySelector('.restart').onclick=()=>{state={step:1,service:0,date:25,time:'10:00'};drawServices();drawCalendar();drawSlots();go(1)};
