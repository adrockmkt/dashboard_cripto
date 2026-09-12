import { describe, expect, it } from "vitest";
import { escapeCsvCell } from "./exportData";

describe("escapeCsvCell", () => {
  it("neutralizes spreadsheet formulas without changing ordinary values", () => {
    expect(escapeCsvCell("=HYPERLINK(\"https://example.test\")")).toBe("\"'=HYPERLINK(\"\"https://example.test\"\")\"");
    expect(escapeCsvCell("+cmd")).toBe("'+cmd");
    expect(escapeCsvCell("-1+1")).toBe("'-1+1");
    expect(escapeCsvCell("@SUM(A1:A2)")).toBe("'@SUM(A1:A2)");
    expect(escapeCsvCell("Bitcoin, BTC")).toBe('"Bitcoin, BTC"');
    expect(escapeCsvCell("Bitcoin")).toBe("Bitcoin");
  });
});
