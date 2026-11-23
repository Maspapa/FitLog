type MaybeElement = { tagName?: string; closest?: (selector: string) => unknown } | null;

const EDITABLE = ["INPUT", "TEXTAREA", "SELECT"];
const INTERACTIVE = "input, textarea, select, button, a, label, summary";

/** 点在非输入控件上时收起软键盘；点输入框或按钮则保持不动，避免键盘闪烁。 */
export function shouldDismissKeyboard(active: MaybeElement, target: MaybeElement): boolean {
  const tag = active?.tagName ?? "";
  if (!EDITABLE.includes(tag)) return false;
  const keep = typeof target?.closest === "function" && Boolean(target.closest(INTERACTIVE));
  return !keep;
}
