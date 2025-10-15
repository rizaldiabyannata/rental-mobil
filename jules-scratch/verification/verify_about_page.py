
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        try:
            url = "http://localhost:3000/tentang-kami"
            print(f"Navigating to {url}...")
            await page.goto(url, wait_until="networkidle")
            await page.wait_for_timeout(2000) # Wait for animations
            screenshot_path = "jules-scratch/verification/tentang-kami-modern.png"
            await page.screenshot(path=screenshot_path, full_page=True)
            print(f"Screenshot saved to {screenshot_path}")
        except Exception as e:
            print(f"Could not capture screenshot for {url}. Error: {e}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
