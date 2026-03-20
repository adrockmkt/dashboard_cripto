import { fetchHistoricalData } from "@/services/marketService";

export interface HistoricalPricePoint {
  date: Date;
  price: number;
}

const toDateKey = (date: Date) => date.toISOString().split("T")[0];

export const fetchBitcoinHistoricalRange = async (
  startDate: Date,
  endDate: Date
): Promise<HistoricalPricePoint[]> => {
  const diffDays = Math.max(
    1,
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const response = await fetchHistoricalData("bitcoin", diffDays);
  const prices = response?.prices || [];

  return prices
    .map(([timestamp, price]: [number, number]) => ({
      date: new Date(timestamp),
      price,
    }))
    .filter((point) => point.date >= startDate && point.date <= endDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const findClosestPrice = (series: HistoricalPricePoint[], targetDate: Date) => {
  if (series.length === 0) return null;

  return series.reduce((previous, current) => {
    return Math.abs(current.date.getTime() - targetDate.getTime()) <
      Math.abs(previous.date.getTime() - targetDate.getTime())
      ? current
      : previous;
  });
};

export const compressMonthlySeries = (series: HistoricalPricePoint[]) => {
  const map = new Map<string, HistoricalPricePoint>();

  for (const point of series) {
    const monthKey = `${point.date.getFullYear()}-${String(point.date.getMonth() + 1).padStart(2, "0")}`;
    map.set(monthKey, point);
  }

  return Array.from(map.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const buildIndexedSeries = (series: HistoricalPricePoint[]) => {
  const map = new Map<string, HistoricalPricePoint>();
  series.forEach((point) => {
    map.set(toDateKey(point.date), point);
  });
  return map;
};
