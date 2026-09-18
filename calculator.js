(function (root) {
  'use strict';
  function calculate(amount, annualRate, months, type, interestType, taxType) {
    if (!Number.isSafeInteger(amount) || amount < 0 || amount > 10000000000) throw new RangeError('금액은 0원부터 100억원까지 정수로 입력하세요.');
    if (!Number.isFinite(annualRate) || annualRate < 0 || annualRate > 30) throw new RangeError('금리는 0%부터 30%까지 입력하세요.');
    if (!Number.isInteger(months) || months < 1 || months > 600) throw new RangeError('기간은 1개월부터 600개월까지 정수로 입력하세요.');
    if (!['deposit', 'savings'].includes(type) || !['simple', 'compound'].includes(interestType) || !['normal', 'none'].includes(taxType)) throw new RangeError('계산 조건을 선택하세요.');
    const rate = annualRate / 1200;
    const principal = type === 'deposit' ? amount : amount * months;
    const interest = n => interestType === 'simple' ? amount * rate * n : amount * Math.expm1(n * Math.log1p(rate));
    let rawGross = 0;
    if (type === 'deposit') rawGross = interest(months);
    else for (let n = 1; n <= months; n++) rawGross += interest(n);
    // Round displayed components consistently so principal + net equals maturity.
    const gross = Math.round(rawGross);
    if (!Number.isSafeInteger(gross) || !Number.isSafeInteger(principal + gross)) throw new RangeError('금액·금리·기간 조합의 결과가 계산 지원 범위를 초과합니다. 입력 범위를 줄이세요.');
    const tax = taxType === 'normal' ? Math.round(gross * .154) : 0;
    const net = gross - tax;
    return {principal, gross, tax, net, final: principal + net};
  }
  const api = {calculate};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SavingsCalculator = api;
})(globalThis);
