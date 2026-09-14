import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotificationCenter } from "./NotificationCenter";

describe("NotificationCenter", () => {
  it("names the button that opens notifications", () => {
    render(<NotificationCenter />);

    expect(screen.getByRole("button", { name: "Abrir notificações" })).toBeVisible();
  });
});
