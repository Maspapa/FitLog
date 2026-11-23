import { describe, expect, it } from "vitest";
import { shouldDismissKeyboard } from "../lib/keyboard";

const input = { tagName: "INPUT" };
const div = { tagName: "DIV", closest: () => null };
const otherInput = { tagName: "INPUT", closest: () => ({}) };
const button = { tagName: "BUTTON", closest: () => ({}) };

describe("tapping outside inputs closes the soft keyboard", () => {
  it("dismisses when the focus is in a field and the tap lands on plain content", () => {
    expect(shouldDismissKeyboard(input, div)).toBe(true);
  });
  it("keeps the keyboard when the tap lands on another field or a button", () => {
    expect(shouldDismissKeyboard(input, otherInput)).toBe(false);
    expect(shouldDismissKeyboard(input, button)).toBe(false);
  });
  it("does nothing when no field is focused", () => {
    expect(shouldDismissKeyboard(div, div)).toBe(false);
    expect(shouldDismissKeyboard(null, div)).toBe(false);
  });
});