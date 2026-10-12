'use client';

import React, { useEffect, useState } from 'react';

interface AvailabilityData {
  status: 'available' | 'busy' | 'away';
  note: string;
  workingHours: string;
  preferredRoles: string[];
}

export const AvailabilityBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [data, setData] = useState<AvailabilityData>({
    status: 'available',
    note: 'Open to opportunities',
    workingHours: 'Mon–Fri 10am–7pm IST',
    preferredRoles: ['Full-Stack Engineer'],
  });

  useEffect(() => {
    let mounted = true;

    const fetchAvailability = async () => {
      try {
        const res = await fetch('/api/availability');
        if (res.ok) {
          const json = await res.json();
          if (mounted && json?.data) {
            setData(json.data);
          }
        }
      } catch {
        // Fallback default kept
      }
    };

    fetchAvailability();
    const interval = setInterval(fetchAvailability, 5 * 60 * 1000); // 5 min refresh
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const colorMap = {
    available: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
    busy: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
    away: 'bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.4)]',
  };

  const labelMap = {
    available: 'Available',
    busy: 'Busy',
    away: 'Away',
  };

  return (
    <div
      role="status"
      title={`${data.note} (${data.workingHours})`}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-300 transition-colors ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${colorMap[data.status] ?? colorMap.available}`} />
      <span>{labelMap[data.status] ?? 'Available'}</span>
    </div>
  );
};
