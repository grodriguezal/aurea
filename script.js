(()=>{
  const menuToggle=document.getElementById('menuToggle');
  const menu=document.getElementById('mobileNav');
  if(menuToggle&&menu){menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')==='true';menuToggle.setAttribute('aria-expanded',String(!open));menuToggle.setAttribute('aria-label',open?'Abrir menú':'Cerrar menú');menu.hidden=open;});menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.hidden=true;menuToggle.setAttribute('aria-expanded','false');}));}
  const selected=new Set(['Anillos']);
  const chips=document.querySelectorAll('[data-piece]');
  chips.forEach(chip=>chip.addEventListener('click',()=>{const name=chip.dataset.piece;selected.has(name)?selected.delete(name):selected.add(name);chips.forEach(c=>{const active=selected.has(c.dataset.piece);c.classList.toggle('active',active);c.setAttribute('aria-pressed',String(active));});}));
  const form=document.getElementById('valuationForm');
  const first=document.getElementById('valuationFirstStep');
  const second=document.getElementById('valuationSecondStep');
  const number=document.querySelector('.step-number');
  const progress=document.getElementById('stepProgress');
  const label=document.querySelector('.step-progress-label');
  if(form){form.addEventListener('submit',e=>{e.preventDefault();const weight=document.getElementById('weight').value;const purity=document.getElementById('purity').value;document.getElementById('resultPieces').textContent=selected.size?Array.from(selected).join(', ').toLowerCase():'unas piezas de oro';document.getElementById('resultExtras').textContent=[weight?` aproximadamente ${Number(weight).toLocaleString('es-ES')} g`:'',purity?` de ${purity}`:''].filter(Boolean).join(' y ');first.hidden=true;second.hidden=false;number.innerHTML='02 <span>/ 02</span>';progress.style.width='100%';label.textContent='Conoce tus opciones';document.getElementById('valuationCard').scrollIntoView({behavior:'smooth',block:'start'});});}
  document.getElementById('startOver')?.addEventListener('click',()=>{first.hidden=false;second.hidden=true;number.innerHTML='01 <span>/ 02</span>';progress.style.width='50%';label.textContent='Conoce tus piezas';document.getElementById('valuationCard').scrollIntoView({behavior:'smooth',block:'start'});});
  document.getElementById('demoAppointment')?.addEventListener('click',()=>{document.getElementById('appointmentStatus').textContent='Este es un mockup. La solicitud de citas se habilitará al conectar los establecimientos aliados.';});
  document.getElementById('year').textContent=String(new Date().getFullYear());
})();