import { test, expect } from '@playwright/test';
import path from 'path';

const ingredientsHar = path.resolve(__dirname, 'hars/ingredients.har');
const orderHar = path.resolve(__dirname, 'hars/order.har');

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлетка из марсианской Магнолии';
const SAUCE_NAME = 'Соус Spicy-X';

test.describe('Страница конструктора бургера: добавление ингредиентов', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(ingredientsHar, {
      url: '**/api/**',
      notFound: 'abort'
    });
    await page.goto('/');
    await expect(page.getByText(BUN_NAME)).toBeVisible();
  });

  test('добавление булки кладёт её в верх и низ конструктора', async ({
    page
  }) => {
    const bunCard = page.getByTestId('ingredient-bun-1');
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByText(`${BUN_NAME} (верх)`)).toBeVisible();
    await expect(page.getByText(`${BUN_NAME} (низ)`)).toBeVisible();
  });

  test('добавление начинки убирает заглушку "Выберите начинку"', async ({
    page
  }) => {
    const mainCard = page.getByTestId('ingredient-main-1');
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByText('Выберите начинку')).not.toBeVisible();
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(ingredientsHar, {
      url: '**/api/**',
      notFound: 'abort'
    });
    await page.goto('/');
    await expect(page.getByText(BUN_NAME)).toBeVisible();
  });

  test('открывается по клику и показывает данные именно того ингредиента, по которому кликнули', async ({
    page
  }) => {
    await page.getByText(SAUCE_NAME).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText(SAUCE_NAME)).toBeVisible();
    await expect(modal.getByText(BUN_NAME)).not.toBeVisible();
    await expect(page).toHaveURL(/\/ingredients\/sauce-1/);
  });

  test('закрывается по клику на крестик', async ({ page }) => {
    await page.getByText(SAUCE_NAME).click();
    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-close-button').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('закрывается по клику на оверлей', async ({ page }) => {
    await page.getByText(SAUCE_NAME).click();
    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(orderHar, {
      url: '**/api/**',
      notFound: 'abort'
    });

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=Bearer test-access-token; path=/';
    });

    await page.goto('/');
    await expect(page.getByText(BUN_NAME)).toBeVisible();
  });

  test('создаёт заказ, показывает номер и очищает конструктор', async ({
    page
  }) => {
    await page
      .getByTestId('ingredient-bun-1')
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page
      .getByTestId('ingredient-main-1')
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText('12345');

    await page.getByTestId('modal-close-button').click();
    await expect(modal).not.toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();
  });
});
