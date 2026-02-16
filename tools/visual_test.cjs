const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const url = process.env.URL || "http://localhost:5174/";
  const outDir = path.join("/tmp", "front_visual");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const contexts = [
    { name: "desktop", viewport: { width: 1280, height: 800 } },
    { name: "tablet", viewport: { width: 768, height: 1024 } },
    {
      name: "mobile",
      viewport: { width: 375, height: 812 },
      isMobile: true,
      hasTouch: true,
    },
  ];

  const routes = [
    { slug: "home", path: "/" },
    { slug: "login", path: "/login" },
    { slug: "registro", path: "/registro" },
    { slug: "reportar", path: "/reportar" },
  ];

  for (const c of contexts) {
    const context = await browser.newContext({
      viewport: c.viewport,
      isMobile: !!c.isMobile,
      hasTouch: !!c.hasTouch,
    });
    const page = await context.newPage();
    for (const r of routes) {
      try {
        const target = new URL(r.path, url).toString();
        console.log("Opening", target, "at", c.name);
        await page.goto(target, { waitUntil: "networkidle", timeout: 30000 });
        await page.waitForTimeout(800);
        const file = path.join(outDir, `${r.slug}_${c.name}.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log("Saved", file);
      } catch (e) {
        console.error(
          "Error capturing",
          r.path,
          c.name,
          e && e.message ? e.message : e,
        );
      }
    }
    await context.close();
  }

  await browser.close();
  console.log("All done. Screenshots saved to", outDir);
})();
