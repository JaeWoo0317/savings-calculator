'use strict';
let type = 'deposit', interestType = 'simple', taxType = 'normal';
const fmt = n => Math.round(n).toLocaleString('ko-KR') + '원';
const QUICK = {deposit:[[1000000,'100만'],[5000000,'500만'],[10000000,'1천만'],[30000000,'3천만']],savings:[[100000,'10만'],[300000,'30만'],[500000,'50만'],[1000000,'100만']]};
function setP(v){document.getElementById('amount').value=v;calc();}
function setR(v){document.getElementById('rate').value=v;calc();}
function setM(v){document.getElementById('months').value=v;calc();}
function switchType(t){type=t;document.querySelectorAll('.tab-btn').forEach((b,i)=>{const active=(t==='deposit'&&i===0)||(t==='savings'&&i===1);b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});document.getElementById('amtLabel').textContent=t==='deposit'?'예치 금액':'월 납입금';document.getElementById('amount').value=t==='deposit'?10000000:500000;renderQuick();calc();}
function renderQuick(){document.getElementById('amtQuick').innerHTML=QUICK[type].map(([v,l])=>'<button class="quick-btn" onclick="setP('+v+')">'+l+'원</button>').join('');}
function setInterestType(t){interestType=t;['rSimple','rCompound'].forEach((id,i)=>{const active=t===(i?'compound':'simple');document.getElementById(id).classList.toggle('active',active);document.getElementById(id).setAttribute('aria-pressed',String(active));});calc();}
function setTax(t){taxType=t;['tNormal','tNone'].forEach((id,i)=>{const active=t===(i?'none':'normal');document.getElementById(id).classList.toggle('active',active);document.getElementById(id).setAttribute('aria-pressed',String(active));});calc();}
function calc(){
  try {
    const inputs=['amount','rate','months'].map(id=>document.getElementById(id).value);
    if(inputs.some(v=>!v.trim())) throw new Error('금액, 금리, 기간을 모두 입력하세요.');
    const r=SavingsCalculator.calculate(...inputs.map(Number),type,interestType,taxType);
    document.getElementById('inputError').textContent='';
    for(const [id,key] of Object.entries({finalAmount:'final',principal:'principal',grossInterest:'gross',tax:'tax',netInterest:'net'})) document.getElementById(id).textContent=fmt(r[key]);
    document.getElementById('finalSub').textContent=(type==='deposit'?'예금':'적금')+' 예상 만기 수령액 ('+(interestType==='simple'?'단리':'월복리')+')';
  }catch(e){
    document.getElementById('inputError').textContent=e.message;
    ['finalAmount','principal','grossInterest','tax','netInterest'].forEach(id=>document.getElementById(id).textContent='-');
    document.getElementById('finalSub').textContent='입력 조건을 확인하세요.';
  }
}
function toggleFaq(el) { const open = el.parentElement.classList.toggle("open"); el.setAttribute("aria-expanded", String(open)); }
['amount','rate','months'].forEach(id=>document.getElementById(id).addEventListener('input',calc));
renderQuick();calc();
