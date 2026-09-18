const {test}=require('node:test');
const assert=require('node:assert/strict');
const {calculate}=require('./calculator.js');
test('simple deposit and monthly installment examples',()=>{
 assert.deepEqual(calculate(10000000,3.5,12,'deposit','simple','normal'),{principal:10000000,gross:350000,tax:53900,net:296100,final:10296100});
 assert.deepEqual(calculate(500000,4,12,'savings','simple','normal'),{principal:6000000,gross:130000,tax:20020,net:109980,final:6109980});
 assert.equal(calculate(6000000,4,12,'deposit','simple','normal').gross,240000);
});
test('monthly compounding agrees with independent balance recurrence',()=>{
 for(const type of ['deposit','savings'])for(const months of [1,12,60,600]){
  let balance=type==='deposit'?123456:0;
  for(let i=0;i<months;i++){if(type==='savings')balance+=123456;balance*=1+.043/12;}
  const r=calculate(123456,4.3,months,type,'compound','normal');
  assert.equal(r.gross,Math.round(balance-r.principal));
  assert.equal(r.net+r.tax,r.gross);assert.equal(r.principal+r.net,r.final);
 }
});
test('zero inputs and exempt tax',()=>{
 for(const type of ['deposit','savings'])for(const method of ['simple','compound']){
  const r=calculate(10000,0,12,type,method,'normal');assert.equal(r.gross,0);assert.equal(r.final,r.principal);
  assert.equal(calculate(0,4,12,type,method,'normal').final,0);
  assert.equal(calculate(10000,4,12,type,method,'none').tax,0);
 }
});
test('invalid inputs',()=>{
 for(const a of [[-1,4,12],[1,NaN,12],[1,31,12],[1,4,0],[1,4,1.5],[1,4,601]])assert.throws(()=>calculate(...a,'deposit','simple','normal'),RangeError);
 assert.throws(()=>calculate(1,4,12,'bad','simple','normal'),RangeError);
 assert.throws(()=>calculate(10000000000,30,600,'savings','compound','normal'),RangeError);
});
