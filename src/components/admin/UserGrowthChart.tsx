'use client';

import React, { useState } from 'react';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { userGrowthData } from '@/lib/mockData';

export default function UserGrowthChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Chart dimensions & scaling
  const width = 560;
  const height = 180;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxVal = 12000;

  // Calculate coordinates for students and parents
  const pointsStudents = userGrowthData.map((d, i) => {
    const x = paddingLeft + (i / (userGrowthData.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.students / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  const pointsParents = userGrowthData.map((d, i) => {
    const x = paddingLeft + (i / (userGrowthData.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.parents / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  // Generate smooth SVG bezier path
  const makeSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 5;
      const cp1y = p1.y + (p2.y - p0.y) / 5;
      const cp2x = p2.x - (p3.x - p1.x) / 5;
      const cp2y = p2.y - (p3.y - p1.y) / 5;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  };

  const studentsLinePath = makeSmoothPath(pointsStudents);
  const studentsAreaPath = `${studentsLinePath} L ${pointsStudents[pointsStudents.length - 1].x},${
    paddingTop + chartHeight
  } L ${pointsStudents[0].x},${paddingTop + chartHeight} Z`;

  const parentsLinePath = makeSmoothPath(pointsParents);

  const yLabels = ['12K', '10K', '8K', '6K', '4K', '2K', '0'];

  return (
    <div className="p-6 rounded-2xl neu-card flex flex-col justify-between h-full relative overflow-hidden">
      {/* Header & Legends */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
            <BarChart2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">User Growth</h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
            <span>Students</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FDBA74]" />
            <span>Parents</span>
          </div>
        </div>
      </div>

      {/* SVG Line / Area Graph */}
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Orange gradient area fill */}
            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#FFA64D" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FFA64D" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#FF7A1A" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Horizontal grid lines & Y labels */}
          {yLabels.map((lbl, idx) => {
            const y = paddingTop + (idx / (yLabels.length - 1)) * chartHeight;
            return (
              <g key={lbl}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="9.5"
                  fill="#94A3B8"
                  fontWeight="500"
                >
                  {lbl}
                </text>
              </g>
            );
          })}

          {/* Area fill for students */}
          <path d={studentsAreaPath} fill="url(#growthGradient)" />

          {/* Line for Parents (peach) */}
          <path
            d={parentsLinePath}
            fill="none"
            stroke="#FDBA74"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Line for Students (vibrant orange) */}
          <path
            d={studentsLinePath}
            fill="none"
            stroke="#FF6B00"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Interactive hover points & markers */}
          {pointsStudents.map((pt, i) => (
            <g
              key={pt.date}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Invisible larger hit target */}
              <circle cx={pt.x} cy={pt.y} r="12" fill="transparent" />

              {/* Data points */}
              {(i === pointsStudents.length - 1 || hoveredIndex === i) && (
                <>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#FF6B00"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all"
                  />
                  <circle
                    cx={pointsParents[i].x}
                    cy={pointsParents[i].y}
                    r="4"
                    fill="#FDBA74"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                </>
              )}

              {/* X Axis Labels */}
              <text
                x={pt.x}
                y={height - 2}
                textAnchor="middle"
                fontSize="9"
                fill={hoveredIndex === i ? '#FF6B00' : '#94A3B8'}
                fontWeight={hoveredIndex === i ? '700' : '500'}
              >
                {pt.date}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Tooltip when hovered */}
        {hoveredIndex !== null && (
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg border border-slate-700 backdrop-blur-sm transition-all"
            style={{
              left: `${
                ((pointsStudents[hoveredIndex].x) / width) * 100
              }%`,
            }}
          >
            <div className="font-semibold text-orange-400">
              {userGrowthData[hoveredIndex].date}
            </div>
            <div className="flex gap-3 text-[11px] mt-0.5">
              <span>Students: {userGrowthData[hoveredIndex].students.toLocaleString()}</span>
              <span>Parents: {userGrowthData[hoveredIndex].parents.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

