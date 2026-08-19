export default function LearningCurve() {
  const width = 900;
  const height = 230;
  const pad = 34;
  const series = [
    { label: "Small", points: [12, 18, 21, 25, 28, 31, 34, 34, 37, 39], dash: "6 7", opacity: 0.5 },
    { label: "Medium", points: [13, 24, 35, 46, 54, 61, 67, 71, 74, 77], dash: "0", opacity: 0.72 },
    { label: "Large", points: [14, 29, 44, 58, 70, 80, 87, 91, 94, 96], dash: "0", opacity: 1 },
  ];
  const toPath = (points: number[]) => points.map((p, i) => {
    const x = pad + (i / (points.length - 1)) * (width - pad * 2);
    const y = height - pad - (p / 100) * (height - pad * 2);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1b120d]/90 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">Expected learning curve</div>
          <h3 className="mt-1 text-lg font-semibold">Policy quality improves with training</h3>
        </div>
        <div className="flex gap-4 text-xs text-[#b7a08d]">
          {series.map((item) => <span key={item.label} className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-orange-300" style={{ opacity: item.opacity }} />{item.label}</span>)}
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-white/6 bg-black/10 p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Illustrative learning curve comparing small, medium and large training regimes">
          {[0, 25, 50, 75, 100].map((v) => {
            const y = height - pad - (v / 100) * (height - pad * 2);
            return <g key={v}><line x1={pad} x2={width-pad} y1={y} y2={y} stroke="rgba(196,180,165,.10)"/><text x="4" y={y+4} fill="#8e786a" fontSize="11">{v}</text></g>;
          })}
          {series.map((item) => <path key={item.label} d={toPath(item.points)} fill="none" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" strokeDasharray={item.dash} opacity={item.opacity} />)}
          <text x={width/2-38} y={height-4} fill="#8e786a" fontSize="11">training episodes →</text>
          <text transform={`translate(11 ${height/2+32}) rotate(-90)`} fill="#8e786a" fontSize="11">policy quality</text>
        </svg>
      </div>
      <p className="mt-3 text-[11px] leading-5 text-[#8e786a]">Illustrative curve for this educational MVP; values are not measurements from a production neural network.</p>
    </div>
  );
}
