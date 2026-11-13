interface AvatarProps {
  name: string;
  picture?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-9 w-9 text-sm",
  md: "h-14 w-14 text-lg",
  lg: "h-20 w-20 text-2xl",
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function Avatar({ name, picture, size = "sm", className = "" }: AvatarProps) {
  const base = `${sizeClasses[size]} flex-shrink-0 rounded-full ${className}`;

  if (picture) {
    return (
      <img
        src={picture}
        alt={name}
        referrerPolicy="no-referrer"
        className={`${base} object-cover`}
      />
    );
  }

  return (
    <div
      className={`${base} flex items-center justify-center bg-gradient-to-br from-navy-600 to-sky-500 font-semibold text-white`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}
