import {
  FaCar,
  FaMapMarkedAlt,
  FaClock,
  FaUsers,
  FaUmbrellaBeach,
} from "react-icons/fa";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// Example: features = ["car", "beach", "city", "group", "duration"]
const ICON_MAP = {
  car: FaCar,
  beach: FaUmbrellaBeach,
  city: FaMapMarkedAlt,
  group: FaUsers,
  duration: FaClock,
};

const FEATURE_LABELS = {
  car: "Mobil nyaman untuk perjalanan",
  beach: "Destinasi pantai & wisata air",
  city: "City tour & landmark",
  group: "Cocok untuk rombongan",
  duration: "Durasi perjalanan",
};

export default function TourFeatureIcons({ features = [] }) {
  return (
    <div className="flex gap-2 mt-2 mb-1">
      {features.map((feature, idx) => {
        const Icon = ICON_MAP[feature] || FaCar;
        const label = FEATURE_LABELS[feature] || feature;
        return (
          <Tooltip key={feature + idx}>
            <TooltipTrigger asChild>
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-help"
              >
                <Icon className="w-4 h-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              {label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
