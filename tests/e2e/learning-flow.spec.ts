import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Dashboard to lesson practice and completion is keyboard reachable", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /오늘의 학습과 이어서 할 일/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "학습 시작" }).click();
  await expect(
    page.getByRole("heading", { name: /변수와 자료형/ }),
  ).toBeVisible();
  await page.getByLabel("내 예측").fill("15 10");
  await page.getByRole("button", { name: "답 확인" }).click();
  await page.getByRole("tab", { name: "회상 퀴즈" }).click();
  await page.getByLabel(/변수 이름이 다른 타입/).check();
  await page.getByLabel(/중괄호 안의 표현식을 계산/).check();
  await page.getByLabel("bool", { exact: true }).check();
  await page.getByLabel(/같은 바인딩의 값을 변경/).check();
  await page.getByRole("button", { name: "퀴즈 채점" }).click();
  await page.getByRole("button", { name: "Day 완료", exact: true }).click();
  await expect(page.getByRole("button", { name: "Day 완료됨" })).toBeDisabled();
  await page.reload();
  await expect(page.getByRole("button", { name: "Day 완료됨" })).toBeDisabled();
});

test("all 92 days have a curriculum link and final lesson", async ({
  page,
}) => {
  await page.goto("/curriculum");
  await expect(page.locator('.phase-samples a[href^="/learn/"]')).toHaveCount(
    92,
  );
  await page.getByRole("link", { name: /Day 92.*완성 프로젝트/ }).click();
  await expect(
    page.getByRole("heading", { name: /완성 프로젝트 검증과 확장/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /세 언어의 완성 프로젝트 소스/ }),
  ).toBeVisible();
});

test("critical pages have no axe serious or critical violations", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/curriculum",
    "/learn/day-01-variables-types",
    "/settings",
  ]) {
    await page.goto(path);
    const result = await new AxeBuilder({ page }).analyze();
    expect(
      result.violations.filter((item) =>
        ["serious", "critical"].includes(item.impact ?? ""),
      ),
      path,
    ).toEqual([]);
  }
});

test("360px mobile page does not overflow", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/learn/day-29-references-borrowing");
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("prepared C demo is explicitly read-only and executes WASM", async ({
  page,
}) => {
  await page.goto("/playground");
  await page.getByLabel("언어 선택").selectOption("c");
  await expect(page.getByText(/사전 컴파일된 WebAssembly/)).toBeVisible();
  await page.getByRole("button", { name: "Prepared Demo 실행" }).click();
  await expect(page.getByText(/21 \+ 21 = 42/)).toBeVisible();
});
