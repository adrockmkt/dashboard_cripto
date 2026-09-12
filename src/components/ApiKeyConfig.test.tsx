import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ApiKeyConfig from "./ApiKeyConfig";

describe("ApiKeyConfig", () => {
  it("does not persist provider keys in localStorage", () => {
    render(<ApiKeyConfig />);

    fireEvent.change(screen.getByLabelText("CoinGecko API Key"), { target: { value: "secret-key" } });
    fireEvent.click(screen.getByRole("button", { name: /salvar configurações/i }));

    expect(localStorage.getItem("coingecko_api_key")).toBeNull();
  });
});
