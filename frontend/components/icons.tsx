import { SVGProps } from 'react';

function IconBase(props: SVGProps<SVGSVGElement>) {
  return <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" {...props} />;
}

export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" {...props}>
      <rect x="2" y="2" width="36" height="36" rx="12" fill="url(#leadmap-gradient)" />
      <path d="M11 26.5L16.8 20.7L20.7 24.6L29 16.3" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24.7 16.3H29V20.6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="leadmap-gradient" x1="5" y1="6" x2="34" y2="35" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67E8F9" />
          <stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="5" rx="2" />
      <rect x="13" y="10" width="8" height="11" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
    </IconBase>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20L16.65 16.65" />
    </IconBase>
  );
}

export function MapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M9 18L3.5 20.5V6L9 3.5L15 6L20.5 3.5V18L15 20.5L9 18Z" />
      <path d="M9 3.5V18" />
      <path d="M15 6V20.5" />
    </IconBase>
  );
}

export function DraftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M4 5.5A2.5 2.5 0 016.5 3H17l3 3v12.5A2.5 2.5 0 0117.5 21h-11A2.5 2.5 0 014 18.5V5.5Z" />
      <path d="M8 11H16" />
      <path d="M8 15H13" />
      <path d="M17 3V7H20" />
    </IconBase>
  );
}

export function FollowUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12L15.5 14" />
    </IconBase>
  );
}

export function AnalyticsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M5 18.5V10.5" />
      <path d="M12 18.5V5.5" />
      <path d="M19 18.5V13.5" />
      <path d="M4 18.5H20" />
    </IconBase>
  );
}

export function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 8.5A3.5 3.5 0 1112 15.5A3.5 3.5 0 0112 8.5Z" />
      <path d="M19.4 15A1.7 1.7 0 0019.75 16.85L19.8 16.9A2 2 0 1116.97 19.73L16.92 19.68A1.7 1.7 0 0015.07 19.33A1.7 1.7 0 0014 20.89V21A2 2 0 1110 21V20.89A1.7 1.7 0 008.93 19.33A1.7 1.7 0 007.08 19.68L7.03 19.73A2 2 0 114.2 16.9L4.25 16.85A1.7 1.7 0 004.6 15A1.7 1.7 0 003.04 14H3A2 2 0 113 10H3.04A1.7 1.7 0 004.6 9A1.7 1.7 0 004.25 7.15L4.2 7.1A2 2 0 117.03 4.27L7.08 4.32A1.7 1.7 0 008.93 4.67A1.7 1.7 0 0010 3.11V3A2 2 0 1114 3V3.11A1.7 1.7 0 0015.07 4.67A1.7 1.7 0 0016.92 4.32L16.97 4.27A2 2 0 1119.8 7.1L19.75 7.15A1.7 1.7 0 0019.4 9A1.7 1.7 0 0020.96 10H21A2 2 0 1121 14H20.96A1.7 1.7 0 0019.4 15Z" />
    </IconBase>
  );
}

export function LogsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M6.5 4H18a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6.5L6.5 4Z" />
      <path d="M8 9H16" />
      <path d="M8 13H16" />
      <path d="M8 17H13" />
      <path d="M4 6.5H6.5V4" />
    </IconBase>
  );
}

export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M7 17L17 7" />
      <path d="M9 7H17V15" />
    </IconBase>
  );
}

export function SparkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 3L13.7 8.3L19 10L13.7 11.7L12 17L10.3 11.7L5 10L10.3 8.3L12 3Z" />
      <path d="M19 4L19.7 6.3L22 7L19.7 7.7L19 10L18.3 7.7L16 7L18.3 6.3L19 4Z" />
    </IconBase>
  );
}

export function BuildingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M4 20.5H20" />
      <path d="M6 20.5V6.5A1.5 1.5 0 017.5 5H16.5A1.5 1.5 0 0118 6.5V20.5" />
      <path d="M9 8.5H10.5" />
      <path d="M13.5 8.5H15" />
      <path d="M9 12H10.5" />
      <path d="M13.5 12H15" />
      <path d="M11 20.5V16H13V20.5" />
    </IconBase>
  );
}

export function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 12H20.5" />
      <path d="M12 3A14.6 14.6 0 0115.5 12A14.6 14.6 0 0112 21A14.6 14.6 0 018.5 12A14.6 14.6 0 0112 3Z" />
    </IconBase>
  );
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="M4 7L12 13L20 7" />
    </IconBase>
  );
}

export function RevenueIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M7 16.5C7 18.43 9.24 20 12 20C14.76 20 17 18.43 17 16.5C17 14.57 14.76 13 12 13C9.24 13 7 11.43 7 9.5C7 7.57 9.24 6 12 6C14.76 6 17 7.57 17 9.5" />
      <path d="M12 4V20" />
    </IconBase>
  );
}

export function ActivityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M3.5 12H7L9.5 7L14 17L16.5 12H20.5" />
    </IconBase>
  );
}

export function FilterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M4 6H20" />
      <path d="M7 12H17" />
      <path d="M10 18H14" />
    </IconBase>
  );
}

export function CompassIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.5 8.5L13.4 13.4L8.5 15.5L10.6 10.6L15.5 8.5Z" />
    </IconBase>
  );
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12L15.5 13.8" />
    </IconBase>
  );
}

export function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.3L10.8 14.6L15.8 9.6" />
    </IconBase>
  );
}

export function EmptyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <path d="M8 10H16" />
      <path d="M8 14H12" />
    </IconBase>
  );
}
