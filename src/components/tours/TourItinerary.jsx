import Image from "next/image";

export default function TourItinerary({ itinerary }) {
  if (!Array.isArray(itinerary) || itinerary.length === 0) return null;
  const sortedItinerary = [...itinerary].sort((a, b) => a.day - b.day);

  return (
    <div className="space-y-4">
      {sortedItinerary.map((day, idx) => (
        <div
          key={day.id}
          className="rounded-xl border border-neutral-200 p-4 bg-white"
        >
          <h4 className="font-semibold text-emerald-800">
            Hari {day.day || idx + 1}
            {day.title ? ` - ${day.title}` : ""}
          </h4>
          {Array.isArray(day.activities) && day.activities.length ? (
            <ul className="mt-2 list-disc pl-4 text-sm text-neutral-700">
              {day.activities.map((it, i) => (
                <li key={i}>
                  {typeof it === "string" ? it : it?.title || "Kegiatan"}
                </li>
              ))}
            </ul>
          ) : null}
          {Array.isArray(day.images) && day.images.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {day.images.map((src) => (
                <div key={src} className="relative aspect-video">
                  <Image
                    src={src}
                    alt={`Gambar untuk hari ${day.day}`}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
