
import asyncio
from playwright.async_api import async_playwright

async def main():
    urls_to_capture = {
        "forgot-password": "http://localhost:3000/forgot-password",
        "harga-sewa-harian": "http://localhost:3000/harga/sewa-harian",
        "harga-paket-tour": "http://localhost:3000/harga/paket-tour",
        "harga-antar-jemput": "http://localhost:3000/harga/antar-jemput",
        "login": "http://localhost:3000/login",
        "reset-password": "http://localhost:3000/reset-password",
        "sewa-mobil-layanan": "http://localhost:3000/sewa-mobil-layanan",
    }

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        for name, url in urls_to_capture.items():
            try:
                print(f"Navigating to {url}...")
                await page.goto(url, wait_until="networkidle")
                await page.wait_for_timeout(1000) # Wait for animations or late-loading elements
                screenshot_path = f"jules-scratch/verification/{name}.png"
                await page.screenshot(path=screenshot_path, full_page=True)
                print(f"Screenshot saved to {screenshot_path}")
            except Exception as e:
                print(f"Could not capture screenshot for {url}. Error: {e}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
