export default function TourMeta({
  durationDays,
  durationHours,
  inclusions,
  exclusions,
}) {
  const durationText = durationDays
    ? `${durationDays} Hari${durationHours ? ` ${durationHours} Jam` : ""}`
    : durationHours
    ? `${durationHours} Jam`
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        {durationText ? (
          <p className="text-sm text-neutral-700">
            Durasi: <span className="font-semibold">{durationText}</span>
          </p>
        ) : null}
        {Array.isArray(inclusions) && inclusions.length ? (
          <div className="mt-3">
            <h4 className="font-semibold text-emerald-800">Termasuk</h4>
            <ul className="mt-1 list-disc pl-4 text-sm text-neutral-700">
              {inclusions.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div>
        {Array.isArray(exclusions) && exclusions.length ? (
          <div>
            <h4 className="font-semibold text-emerald-800">Tidak Termasuk</h4>
            <ul className="mt-1 list-disc pl-4 text-sm text-neutral-700">
              {exclusions.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
