from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the homepage with the explicit 'id' locale
        page.goto("http://localhost:3000/id")

        # Wait for the hero section to be visible to ensure the page is loaded
        hero_section_title_id = page.locator("h1:has-text('Sewa Mobil Terbaik di Lombok')")
        expect(hero_section_title_id).to_be_visible(timeout=10000)

        # Click the 'EN' button in the language switcher
        en_button = page.get_by_role("button", name="EN")
        en_button.click()

        # Wait for the URL to change to the 'en' locale
        page.wait_for_url("http://localhost:3000/en", timeout=10000)

        # Verify that the hero section text has changed to the English placeholder
        hero_section_title_en = page.locator("h1:has-text('[EN] Car Rental Best in Lombok')")
        expect(hero_section_title_en).to_be_visible(timeout=10000)

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run_verification()
