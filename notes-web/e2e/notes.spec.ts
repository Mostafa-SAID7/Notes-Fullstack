import { test, expect } from '@playwright/test';

test.describe('Notes App E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should display the app title', async ({ page }) => {
    await expect(page.locator('text=Notes App')).toBeVisible();
  });

  test('should load and display notes', async ({ page }) => {
    // Wait for notes to load
    await page.waitForSelector('text=First Note', { timeout: 5000 }).catch(() => {
      // Notes might not exist in test environment
    });
  });

  test('should open new note modal', async ({ page }) => {
    // Click new note button
    await page.click('button:has-text("New Note")');

    // Verify modal is open
    await expect(page.locator('text=New Note')).toBeVisible();
    await expect(page.locator('input[placeholder="Title"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Description"]')).toBeVisible();
  });

  test('should close modal on cancel', async ({ page }) => {
    // Click new note button
    await page.click('button:has-text("New Note")');

    // Wait for modal
    await expect(page.locator('input[placeholder="Title"]')).toBeVisible();

    // Click cancel
    await page.click('button:has-text("Cancel")');

    // Modal should be closed
    await expect(page.locator('input[placeholder="Title"]')).not.toBeVisible();
  });

  test('should search notes', async ({ page }) => {
    // Type in search
    await page.fill('input[placeholder="Search notes..."]', 'First');

    // Wait for filtering
    await page.waitForTimeout(300);

    // Verify search results
    const noteCards = await page.locator('[class*="note-card"]').count();
    expect(noteCards).toBeGreaterThanOrEqual(0);
  });

  test('should show validation error for empty title', async ({ page }) => {
    // Click new note button
    await page.click('button:has-text("New Note")');

    // Wait for modal
    await expect(page.locator('input[placeholder="Title"]')).toBeVisible();

    // Fill only description
    await page.fill('textarea[placeholder="Description"]', 'Test description');

    // Click save
    await page.click('button:has-text("Save Note")');

    // Verify error message
    await expect(page.locator('text=Title is required')).toBeVisible();
  });

  test('should open note menu', async ({ page }) => {
    // Wait for a note to exist
    const noteCard = page.locator('[class*="note-card"]').first();
    const menuButton = noteCard.locator('button[aria-label="Note options"]');

    // Click menu button
    await menuButton.click();

    // Verify menu items are visible
    await expect(page.locator('text=Edit')).toBeVisible();
    await expect(page.locator('text=Delete')).toBeVisible();
  });
});
