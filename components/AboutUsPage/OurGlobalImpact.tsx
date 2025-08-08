"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { impactCountries } from "@/lib/data";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
import dynamic from "next/dynamic";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function getHeatColor(intensity: number): string {
  if (intensity >= 90) return "#1E40AF"; // Very dark blue
  if (intensity >= 70) return "#1D4ED8"; // Dark blue
  if (intensity >= 50) return "#3B82F6"; // Blue
  if (intensity >= 30) return "#60A5FA"; // Light blue
  if (intensity >= 10) return "#93C5FD"; // Very light blue
  return "#E5E7EB"; // Gray for no impact
}

const MapComponent = () => {
  const [tooltipContent, setTooltipContent] = useState<{
    name: string;
    alpha2Code: string;
    intensity: number;
  } | null>(null);

  return (
    <div className="w-full max-w-2xl h-[320px]">
      <TooltipProvider>
        <ComposableMap
          projectionConfig={{ scale: 140 }}
          width={800}
          height={400}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isoCode = geo.properties.ISO_A3;
                const match = impactCountries.find((c) => c.code === isoCode);
                const fillColor = match
                  ? getHeatColor(match.intensity)
                  : "#E5E7EB";

                return (
                  <Tooltip key={geo.rsmKey}>
                    <TooltipTrigger asChild>
                      <Geography
                        geography={geo}
                        fill={fillColor}
                        stroke="#ffffff"
                        strokeWidth={0.5}
                        onMouseEnter={() => {
                          setTooltipContent({
                            name: geo.properties.name,
                            alpha2Code:
                              geo.properties.ISO_A2 ||
                              geo.properties.ISO_A3?.slice(0, 2) ||
                              "",
                            intensity: match?.intensity || 0,
                          });
                        }}
                        onMouseLeave={() => setTooltipContent(null)}
                        style={{
                          default: { outline: "none" },
                          hover: {
                            outline: "none",
                            cursor: "pointer",
                            fill: match ? "#2563EB" : "#D1D5DB",
                          },
                          pressed: { outline: "none" },
                        }}
                      />
                    </TooltipTrigger>
                    {tooltipContent && (
                      <TooltipContent className="p-2 text-center">
                        <div className="flex flex-col items-center">
                          {tooltipContent.alpha2Code && (
                            <img
                              src={`https://flagcdn.com/w40/${tooltipContent.alpha2Code.toLowerCase()}.png`}
                              alt={tooltipContent.name}
                              className="w-8 h-5 object-cover mb-1"
                            />
                          )}
                          <span className="text-xs font-medium text-gray-800">
                            {tooltipContent.name}
                          </span>
                          <span className="text-xs text-gray-600">
                            Impact: {tooltipContent.intensity}%
                          </span>
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })
            }
          </Geographies>

          {/* 🔵 Markers with labels */}
          {impactCountries.map((country, index) => (
            <Marker key={index} coordinates={country.coordinates}>
              <circle
                r={6}
                fill="#2563EB"
                stroke="#1E3A8A"
                strokeWidth={1.5}
                className="animate-pulse"
              />
              <circle
                r={12}
                fill="none"
                stroke="#2563EB"
                strokeWidth={1}
                className="animate-ping opacity-75"
              />
              <text
                textAnchor="middle"
                y={-10}
                style={{
                  fontFamily: "system-ui",
                  fill: "#111827",
                  fontSize: "10px",
                  fontWeight: 600,
                }}
              >
                {country.name}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </TooltipProvider>
    </div>
  );
};

const DynamicMap = dynamic(() => Promise.resolve(MapComponent), { ssr: false });

export default function GlobalImpactSection() {
  return (
    <section className="bg-white py-16 px-4 sm:px-8 lg:px-16">
      <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center">
        Our Global Impact
      </h2>
      <p className="text-center text-gray-600 mt-6 mb-12">
        Operating from UK → Reaching the World
      </p>

      <div className="flex flex-col lg:flex-row items-center justify-between md:gap-12">
        <DynamicMap />

        {/* Stats */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-center text-gray-800 lg:-mt-12">
          <div className="w-36">
            <p className="text-4xl font-extrabold text-gray-600">10+</p>
            <p className="text-[1rem]">Countries</p>
          </div>
          <div className="w-36">
            <p className="text-4xl font-extrabold text-gray-600">4</p>
            <p className="text-[1rem]">Continents</p>
          </div>
          <div className="w-36">
            <p className="text-4xl font-extrabold text-gray-600">1K+</p>
            <p className="text-[1rem]">Digital CVs Built</p>
          </div>
          <div className="w-36">
            <p className="text-4xl font-extrabold text-gray-600">800+</p>
            <p className="text-[1rem]">Coaching Sessions</p>
          </div>
          <div className="w-36">
            <p className="text-4xl font-extrabold text-gray-600">100+</p>
            <p className="text-[1rem]">Corporate Clients</p>
          </div>
        </div>
      </div>
    </section>
  );
}
