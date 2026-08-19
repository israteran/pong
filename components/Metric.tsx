type MetricProps = {
  label: string;
  value: string | number;
  hint?: string;
};

export default function Metric({ label, value, hint }: MetricProps) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a48d7d]">{label}</div>
      <div className="metric-value mt-1 text-lg font-semibold text-[#fff7ed]">{value}</div>
      {hint ? <div className="mt-0.5 text-[10px] text-[#8e786a]">{hint}</div> : null}
    </div>
  );
}
