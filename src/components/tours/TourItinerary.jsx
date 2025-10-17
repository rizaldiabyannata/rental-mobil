export default function TourItinerary({ itinerary }) {
  if (!Array.isArray(itinerary) || itinerary.length === 0) return null;
  return (
    <div className="space-y-4">
      {itinerary.map((day, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-neutral-200 p-4 bg-white"
        >
          <h4 className="font-semibold text-emerald-800">
            Hari {day.day || idx + 1}
            {day.title ? ` - ${day.title}` : ""}
          </h4>
          {Array.isArray(day.items) && day.items.length ? (
            <ul className="mt-2 list-disc pl-4 text-sm text-neutral-700">
              {day.items.map((it, i) => (
                <li key={i}>
                  {typeof it === "string" ? it : it?.title || "Kegiatan"}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}
