// utils/tagColors.ts
export const TAG_COLORS = {
  blue: {
    bg: "bg-blue-200",
    text: "text-blue-700",
  },
  red: {
    bg: "bg-red-200",
    text: "text-red-700",
  },
  green: {
    bg: "bg-green-200",
    text: "text-green-700",
  },
  yellow: {
    bg: "bg-yellow-200",
    text: "text-yellow-700",
  },
  purple: {
    bg: "bg-purple-200",
    text: "text-purple-700",
  },
  pink: {
    bg: "bg-pink-200",
    text: "text-pink-700",
  },
} as const;

export type TagColor = keyof typeof TAG_COLORS;

export const getTagColorClasses = (color: TagColor) => {
  return TAG_COLORS[color];
};
