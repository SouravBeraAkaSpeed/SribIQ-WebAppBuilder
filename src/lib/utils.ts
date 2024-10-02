import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const scaleStyles = (styles: React.CSSProperties, scaleX: number, scaleY: number): React.CSSProperties => {
  const scaleXValue = (value: string | undefined): string | undefined => {
    if (!value) return value;

    const regex = /^(\d*\.?\d+)(px|%|rem|em|vw|vh|vmin|vmax)?$/;
    const match = value.match(regex);
    if (match) {
      const magnitude = parseFloat(match[1]);
      const unit = match[2] || '';
      return (magnitude * scaleX) + unit;
    }
    return value;
  };

  const scaleYValue = (value: string | undefined): string | undefined => {
    if (!value) return value;

    const regex = /^(\d*\.?\d+)(px|%|rem|em|vw|vh|vmin|vmax)?$/;
    const match = value.match(regex);
    if (match) {
      const magnitude = parseFloat(match[1]);
      const unit = match[2] || '';
      return (magnitude * scaleY) + unit;
    }
    return value;
  };

  return {
    ...styles,
    height: scaleYValue(styles.height as string),
    width: scaleXValue(styles.width as string),
    fontSize: scaleXValue(styles.fontSize as string),
    // margin: scaleValue(styles.margin as string),
    marginTop: scaleYValue(styles.marginTop as string),
    marginLeft: scaleXValue(styles.marginLeft as string),
    marginBottom: scaleYValue(styles.marginBottom as string),
    marginRight: scaleXValue(styles.marginRight as string),
    // padding: scaleValue(styles.padding as string),
    paddingBottom: scaleYValue(styles.paddingBottom as string),
    paddingTop: scaleYValue(styles.paddingTop as string),
    paddingLeft: scaleXValue(styles.paddingLeft as string),
    paddingRight: scaleXValue(styles.paddingRight as string)
    
  };
};