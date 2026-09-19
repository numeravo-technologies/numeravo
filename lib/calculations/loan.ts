export type LoanScheduleRow = {
  number: number;
  date: Date;
  beginningBalance: number;
  payment: number;
  principal: number;
  interest: number;
  extra: number;
  endingBalance: number;
};

export function addLoanMonths(date: Date, months: number) {
  const result = new Date(date);
  const day = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() + months);

  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();

  result.setDate(Math.min(day, lastDay));

  return result;
}

export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  months: number,
) {
  if (!principal || !months) return 0;

  const rate = annualRate / 100 / 12;

  if (!rate) {
    return principal / months;
  }

  return (
    principal *
    (rate * (1 + rate) ** months) /
    ((1 + rate) ** months - 1)
  );
}

export function buildLoanSchedule(
  principal: number,
  annualRate: number,
  months: number,
  extra: number,
  start: Date,
): LoanScheduleRow[] {
  const rows: LoanScheduleRow[] = [];

  if (!principal || !months) {
    return rows;
  }

  const regular = calculateLoanPayment(
    principal,
    annualRate,
    months,
  );

  const rate = annualRate / 100 / 12;
  let balance = principal;
  let count = 0;

  const maximum = Math.max(months * 2, 1200);

  while (balance > 0.005 && count < maximum) {
    count += 1;

    const beginningBalance = balance;
    const interest = beginningBalance * rate;

    const availablePrincipal =
      Math.max(0, regular - interest);

    const regularPrincipal =
      Math.min(beginningBalance, availablePrincipal);

    const remainingAfterRegular =
      Math.max(0, beginningBalance - regularPrincipal);

    const appliedExtra =
      Math.min(extra, remainingAfterRegular);

    const principalPaid =
      regularPrincipal + appliedExtra;

    balance =
      Math.max(0, beginningBalance - principalPaid);

    rows.push({
      number: count,
      date: addLoanMonths(start, count - 1),
      beginningBalance,
      payment: interest + principalPaid,
      principal: regularPrincipal,
      interest,
      extra: appliedExtra,
      endingBalance: balance,
    });

    if (regular <= interest && !extra) {
      break;
    }
  }

  return rows;
}

export function getLoanScheduleTotals(
  rows: LoanScheduleRow[],
) {
  return rows.reduce(
    (sum, row) => ({
      paid: sum.paid + row.payment,
      interest: sum.interest + row.interest,
    }),
    {
      paid: 0,
      interest: 0,
    },
  );
}
