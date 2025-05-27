const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(value);

export const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const { month, total } = payload[0].payload;

  return (
    <div className="rounded px-3 py-2 border text-sm shadow-md bg-white text-black dark:bg-zinc-900 dark:text-white dark:border-zinc-700">
      <strong>{month}</strong>
      <br />
      Savings: <span className="font-semibold">{formatCurrency(Number(total))}</span>
    </div>
  );
};
