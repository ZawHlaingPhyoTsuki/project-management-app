// utils/tagColors.ts
export const TAG_COLORS = {
  BLUE: {
    bg: "bg-blue-200",
    text: "text-blue-700",
  },
  RED: {
    bg: "bg-red-200",
    text: "text-red-700",
  },
  GREEN: {
    bg: "bg-green-200",
    text: "text-green-700",
  },
  YELLOW: {
    bg: "bg-yellow-200",
    text: "text-yellow-700",
  },
  PURPLE: {
    bg: "bg-purple-200",
    text: "text-purple-700",
  },
  PINK: {
    bg: "bg-pink-200",
    text: "text-pink-700",
  },
} as const;

export type TagColor = keyof typeof TAG_COLORS;

export const DEFAULT_TAG_COLOR: TagColor = "BLUE";

export const getTagColorClasses = (color: string) => {
  const tagColor = Object.keys(TAG_COLORS).includes(color)
    ? (color as TagColor)
    : DEFAULT_TAG_COLOR;

  return TAG_COLORS[tagColor];
};
