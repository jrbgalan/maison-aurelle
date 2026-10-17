import { chromium, Browser, Page } from "playwright";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import http from "http";
import { spawn, ChildProcess } from "child_process";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const DESKTOP_DIR = path.resolve(process.cwd(), "screenshots", "desktop");
const MOBILE_DIR = path.resolve(process.cwd(), "screenshots", "mobile");

// Ensure output directories exist
fs.mkdirSync(DESKTOP_DIR, { recursive: true });
fs.mkdirSync(MOBILE_DIR, { recursive: true });

/**
 * Checks if the server is already running on the target port
 */
function isServerRunning(urlStr: string): Promise<boolean> {
  return new Promise((resolve) => {
    const url = new URL(urlStr);
    const req = http.get(
      {
        hostname: url.hostname,
        port: url.port || 80,
        path: "/",
        timeout: 2000,
      },
      (res) => {
        resolve(res.statusCode === 200 || res.statusCode === 304);
      }
    );
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Spawns production server if not already running
 */
async function ensureProductionServer(): Promise<ChildProcess | null> {
  const running = await isServerRunning(BASE_URL);
  if (running) {
    console.log(`✓ Server is already running at ${BASE_URL}`);
    return null;
  }

  console.log(`Starting Next.js production server on ${BASE_URL}...`);
  const child = spawn("npx", ["next", "start", "-p", "3000"], {
    shell: true,
    stdio: "inherit",
    cwd: process.cwd(),
  });

  // Wait for server to become responsive
  let ready = false;
  const maxAttempts = 30;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await new Promise((r) => setTimeout(r, 1000));
    ready = await isServerRunning(BASE_URL);
    if (ready) {
      console.log(`✓ Production server ready in ~${attempt}s`);
      break;
    }
  }

  if (!ready) {
    child.kill();
    throw new Error(`Failed to start production server at ${BASE_URL} after 30s`);
  }

  return child;
}

/**
 * Injects CSS to hide scrollbars and mouse cursor
 */
async function injectCleanStyles(page: Page) {
  await page.addStyleTag({
    content: `
      ::-webkit-scrollbar { display: none !important; }
      * { scrollbar-width: none !important; }
      body, * { cursor: none !important; }
    `,
  });
}

/**
 * Slowly scrolls the page down and back up to trigger lazy-loaded images and Framer Motion triggers,
 * then verifies that all images have completely loaded and have naturalWidth > 0.
 */
async function ensurePageFullyLoaded(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);

  // Slow smooth scroll down in steps
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let current = 0;
      const step = 450;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        current += step;
        if (current >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 90);
    });
  });

  await page.waitForTimeout(1200);

  // Smooth scroll back to top
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      const timer = setInterval(() => {
        if (window.scrollY <= 0) {
          clearInterval(timer);
          resolve();
        }
        window.scrollBy(0, -650);
      }, 70);
    });
  });

  await page.waitForTimeout(1000);

  // Wait for all <img> tags to complete loading
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll("img"));
    images.forEach((img) => {
      img.loading = "eager";
    });
    await Promise.all(
      images.map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
          setTimeout(resolve, 4000);
        });
      })
    );
  });

  // Check for any failing images
  const brokenImages = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll("img"));
    return images
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.src || img.currentSrc || "unknown src");
  });

  if (brokenImages.length > 0) {
    console.error(`[WARNING] Detected ${brokenImages.length} unrendered image(s):`, brokenImages);
  } else {
    console.log("  ✓ All images and fonts verified loaded");
  }
}

/**
 * Saves a screenshot as PNG and generates an optimized WebP copy (quality 90)
 */
async function saveShot(
  page: Page,
  folder: "desktop" | "mobile",
  filename: string,
  options: { fullPage?: boolean } = {}
) {
  const dir = folder === "desktop" ? DESKTOP_DIR : MOBILE_DIR;
  const pngPath = path.join(dir, `${filename}.png`);
  const webpPath = path.join(dir, `${filename}.webp`);

  await page.screenshot({ path: pngPath, fullPage: options.fullPage || false });

  // Convert to optimized WebP (WebP max dimension limit is 16383px)
  try {
    const meta = await sharp(pngPath).metadata();
    if (meta.width && meta.height && (meta.width > 16380 || meta.height > 16380)) {
      const scale = 16380 / Math.max(meta.width, meta.height);
      const targetWidth = Math.round(meta.width * scale);
      const targetHeight = Math.round(meta.height * scale);
      await sharp(pngPath)
        .resize({ width: targetWidth, height: targetHeight, fit: "inside" })
        .webp({ quality: 90 })
        .toFile(webpPath);
    } else {
      await sharp(pngPath).webp({ quality: 90 }).toFile(webpPath);
    }
  } catch (err) {
    console.warn(`  [WARN] WebP conversion fallback for ${filename}:`, err);
  }

  console.log(`  📸 Saved [${folder}] ${filename}.png & .webp`);
}

/**
 * Smoothly scrolls to center or frame a target section with custom offset
 */
async function scrollToElement(page: Page, selector: string, topOffset = 80) {
  const el = await page.$(selector);
  if (!el) {
    console.warn(`  [WARN] Selector not found: ${selector}`);
    return;
  }
  const box = await el.boundingBox();
  if (!box) return;

  const currentScrollY = await page.evaluate(() => window.scrollY);
  const targetY = Math.max(0, currentScrollY + box.y - topOffset);

  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "smooth" }), targetY);
  // Wait 2.5 seconds for reveal animations, count-up stats, or timeline activation to finish
  await page.waitForTimeout(2500);
}

async function main() {
  console.log("==================================================");
  console.log("  Maison Aurelle — Automated Portfolio Capture   ");
  console.log("==================================================");

  let serverProcess: ChildProcess | null = null;
  try {
    serverProcess = await ensureProductionServer();
  } catch (err) {
    console.error("Server error:", err);
    process.exit(1);
  }

  const browser: Browser = await chromium.launch({
    headless: true,
  });

  try {
    // ============================================================
    // 1. DESKTOP SHOTS (2560x1440 via 1280x720 @ 2x)
    // ============================================================
    console.log("\n--- Starting Desktop 2K Captures (2560x1440) ---");
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 2,
      colorScheme: "light",
      reducedMotion: "no-preference",
    });

    const page = await desktopContext.newPage();
    await injectCleanStyles(page);

    // --- HOME PAGE CAPTURES ---
    console.log("\nNavigating to Home page...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await ensurePageFullyLoaded(page);

    // 01-hero
    console.log("Capturing 01-hero...");
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(1500);
    await saveShot(page, "desktop", "01-hero");

    // 02-treatments
    console.log("Capturing 02-treatments...");
    await scrollToElement(page, "section:has-text('Signature Rituals')", 60);
    await saveShot(page, "desktop", "02-treatments");

    // 03-record-stats
    console.log("Capturing 03-record-stats...");
    await scrollToElement(page, "section:has-text('The Aurelle Record')", 60);
    await saveShot(page, "desktop", "03-record-stats");

    // 04-chronicle-timeline (3 positions: early, mid, final)
    console.log("Capturing 04-chronicle-timeline (early, mid, final)...");
    const timelineSection = page.locator("section[aria-label='Clinic milestones timeline']");
    const timelineBox = await timelineSection.boundingBox();

    if (timelineBox) {
      const scrollBase = await page.evaluate(() => window.scrollY);
      const startY = scrollBase + timelineBox.y;

      // Early milestone (2014)
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), startY);
      await page.waitForTimeout(2000);
      await saveShot(page, "desktop", "04-chronicle-timeline-early");

      // Mid milestone (2019 / 2021)
      await page.evaluate((y) => window.scrollTo({ top: y + 950, behavior: "instant" }), startY);
      await page.waitForTimeout(2000);
      await saveShot(page, "desktop", "04-chronicle-timeline-mid");

      // Final milestone (2026)
      await page.evaluate((y) => window.scrollTo({ top: y + 1750, behavior: "instant" }), startY);
      await page.waitForTimeout(2000);
      await saveShot(page, "desktop", "04-chronicle-timeline-final");
    }

    // 05-before-after (50% and 70%)
    console.log("Capturing 05-before-after (50% and 70%)...");
    await scrollToElement(page, "section:has-text('The Quiet Reveal')", 50);

    // Shot at 50%
    await page.waitForTimeout(1000);
    await saveShot(page, "desktop", "05-before-after-50");

    // Drag / click slider to ~70%
    const slider = page.locator('[role="slider"]').first();
    const sliderBox = await slider.boundingBox();
    if (sliderBox) {
      await page.mouse.click(sliderBox.x + sliderBox.width * 0.7, sliderBox.y + sliderBox.height * 0.5);
      await page.waitForTimeout(1200);
      await saveShot(page, "desktop", "05-before-after-70");
    }

    // 07-testimonials (with sakura watercolor background)
    console.log("Capturing 07-testimonials...");
    await scrollToElement(page, "section:has-text('In Their Words')", 50);
    await saveShot(page, "desktop", "07-testimonials");

    // 08-gallery (12-column arch mosaic)
    console.log("Capturing 08-gallery...");
    await scrollToElement(page, "section:has-text('The Gallery')", 50);
    await saveShot(page, "desktop", "08-gallery");

    // 10-chatbot (opened mid-conversation with quick replies)
    console.log("Capturing 10-chatbot...");
    await page.evaluate(() => window.scrollTo({ top: 300, behavior: "instant" }));
    const chatBtn = page.locator('button[aria-label*="concierge" i]').first();
    if (await chatBtn.isVisible()) {
      await chatBtn.click();
      await page.waitForTimeout(1200);
      // Wait for chat dialog to animate in
      const dialog = page.locator('[role="dialog"]').first();
      await dialog.waitFor({ state: "visible", timeout: 4000 });
      await page.waitForTimeout(1000);
      await saveShot(page, "desktop", "10-chatbot");
      // Close chat widget so subsequent shots are clean
      const closeBtn = page.locator('button[aria-label*="Close" i]').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(600);
      }
    }

    // 11-footer-cranes
    console.log("Capturing 11-footer-cranes...");
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await page.waitForTimeout(2500);
    await saveShot(page, "desktop", "11-footer-cranes");

    // 13-full-home (Full Page screenshot with navbar hidden for pristine stitching)
    console.log("Capturing 13-full-home (fullPage: true)...");
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const header = document.querySelector("header");
      if (header) header.style.display = "none";
    });
    await page.waitForTimeout(1500);
    await saveShot(page, "desktop", "13-full-home", { fullPage: true });

    // Restore header
    await page.evaluate(() => {
      const header = document.querySelector("header");
      if (header) header.style.display = "";
    });

    // --- 06-SPECIALISTS DIRECTORY PAGE ---
    console.log("\nNavigating to Specialists page...");
    await page.goto(`${BASE_URL}/specialists`, { waitUntil: "networkidle" });
    await ensurePageFullyLoaded(page);
    await scrollToElement(page, "h1, h2", 40);
    await saveShot(page, "desktop", "06-specialists");

    // --- 12-TREATMENT DETAIL PAGE ---
    console.log("\nNavigating to Treatment Detail page...");
    await page.goto(`${BASE_URL}/treatments/facial-skin-rejuvenation`, { waitUntil: "networkidle" });
    await ensurePageFullyLoaded(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(1800);
    await saveShot(page, "desktop", "12-treatment-detail");

    // --- 09-BOOKING FLOW (All steps with demo data) ---
    console.log("\nNavigating to Booking flow...");
    await page.goto(`${BASE_URL}/booking`, { waitUntil: "networkidle" });
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(1200);

    // Step 1: Select Treatment
    console.log("Capturing 09-booking-step1-treatment...");
    const firstTreatmentCard = page.locator("button:has-text('Facial & Skin')").first();
    if (await firstTreatmentCard.isVisible()) {
      await firstTreatmentCard.click();
    }
    await page.waitForTimeout(800);
    await saveShot(page, "desktop", "09-booking-step1-treatment");

    // Advance to Step 2
    await page.click("button:has-text('Continue')");
    await page.waitForTimeout(1000);

    // Step 2: Select Specialist
    console.log("Capturing 09-booking-step2-specialist...");
    const firstAvailableCard = page.locator("button:has-text('First available')").first();
    if (await firstAvailableCard.isVisible()) {
      await firstAvailableCard.click();
    }
    await page.waitForTimeout(800);
    await saveShot(page, "desktop", "09-booking-step2-specialist");

    // Advance to Step 3
    await page.click("button:has-text('Continue')");
    await page.waitForTimeout(1000);

    // Step 3: Date & Time
    console.log("Capturing 09-booking-step3-datetime...");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    const dateStr = tomorrow.toISOString().split("T")[0];
    await page.fill('input[type="date"]', dateStr);
    const timeSlotBtn = page.locator("button:has-text('14:00')").first();
    if (await timeSlotBtn.isVisible()) {
      await timeSlotBtn.click();
    }
    await page.waitForTimeout(800);
    await saveShot(page, "desktop", "09-booking-step3-datetime");

    // Advance to Step 4
    await page.click("button:has-text('Continue')");
    await page.waitForTimeout(1000);

    // Step 4: Guest Details (Demo user Sofia Reyes)
    console.log("Capturing 09-booking-step4-details...");
    await page.fill('input[placeholder*="Elena"]', "Sofia Reyes");
    await page.fill('input[placeholder*="elena@"]', "sofia.reyes@example.com");
    await page.fill('input[type="tel"]', "+1 (555) 392-8192");
    await page.fill('textarea[placeholder*="concierge"]', "First consultation for gentle barrier hydration and seasonal reset.");
    await page.waitForTimeout(800);
    await saveShot(page, "desktop", "09-booking-step4-details");

    // Advance to Step 5 (Review)
    await page.click("button:has-text('Continue')");
    await page.waitForTimeout(1000);

    // Step 5: Review & Confirm
    console.log("Capturing 09-booking-step5-confirm...");
    await saveShot(page, "desktop", "09-booking-step5-confirm");

    // Submit booking for confirmation screen
    console.log("Submitting booking for confirmation receipt...");
    await page.click("button:has-text('Confirm booking')");
    await page.waitForTimeout(2000);
    await saveShot(page, "desktop", "09-booking-step5-confirmed");

    await desktopContext.close();

    // ============================================================
    // 2. MOBILE SHOTS (390x844 @ 3x)
    // ============================================================
    console.log("\n--- Starting Mobile Captures (390x844 @ 3x) ---");
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      colorScheme: "light",
      reducedMotion: "no-preference",
    });

    const mobilePage = await mobileContext.newPage();
    await injectCleanStyles(mobilePage);

    // mobile-01-hero
    console.log("Capturing mobile-01-hero...");
    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await ensurePageFullyLoaded(mobilePage);
    await mobilePage.evaluate(() => window.scrollTo(0, 0));
    await mobilePage.waitForTimeout(1500);
    await saveShot(mobilePage, "mobile", "mobile-01-hero");

    // mobile-02-treatments
    console.log("Capturing mobile-02-treatments...");
    await scrollToElement(mobilePage, "section:has-text('Signature Rituals')", 50);
    await saveShot(mobilePage, "mobile", "mobile-02-treatments");

    // mobile-03-booking
    console.log("Capturing mobile-03-booking...");
    await mobilePage.goto(`${BASE_URL}/booking`, { waitUntil: "networkidle" });
    await mobilePage.waitForLoadState("networkidle");
    await mobilePage.evaluate(() => window.scrollTo(0, 0));
    await mobilePage.waitForTimeout(1200);
    await saveShot(mobilePage, "mobile", "mobile-03-booking");

    // mobile-04-menu-open
    console.log("Capturing mobile-04-menu-open...");
    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await mobilePage.evaluate(() => window.scrollTo(0, 0));
    const menuBtn = mobilePage.locator('button[aria-label*="menu" i]').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await mobilePage.waitForTimeout(1000);
      await saveShot(mobilePage, "mobile", "mobile-04-menu-open");
    }

    await mobileContext.close();

    console.log("\n==================================================");
    console.log("  ✓ All Portfolio Screenshots Captured!           ");
    console.log(`  Desktop (2560x1440 PNG & WebP): ${DESKTOP_DIR}`);
    console.log(`  Mobile (390x844 @3x PNG & WebP): ${MOBILE_DIR}`);
    console.log("==================================================");
  } finally {
    await browser.close();
    if (serverProcess) {
      console.log("Shutting down spawned production server...");
      serverProcess.kill();
    }
  }
}

main().catch((err) => {
  console.error("Fatal screenshot runner error:", err);
  process.exit(1);
});

