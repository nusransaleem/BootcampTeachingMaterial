# Bootcamp Batch 1 — Daraz.lk Playwright Automation

End-to-end test automation for [Daraz.lk](https://www.daraz.lk/#?) using Playwright with the Page Object Model (POM).

## Project structure

```
bootcampbatch1/
├── common/constants.js
├── data/
│   ├── users.json            # valid + invalid credentials
│   └── products.json         # search, filter, and product data
├── env/qa.env, stag.env
├── pages/
│   ├── BasePage.js
│   ├── common/Header.js, SearchBar.js
│   ├── home/HomePage.js
│   ├── product/ProductListingPage.js, ProductDetailsPage.js
│   ├── cart/CartPage.js
│   └── user/LoginPage.js, AccountPage.js, SettingsPage.js
├── tests/auth.setup.js         # Saves logged-in session for cart tests
├── tests/specs/
│   ├── home.spec.js          # TC-10 – TC-13
│   ├── login.spec.js         # TC-01, TC-02, TC-17
│   ├── auth.spec.js          # TC-14 – TC-16
│   ├── search.spec.js        # TC-03 – TC-06, TC-18 – TC-22
│   ├── product.spec.js       # TC-23 – TC-25
│   └── cart.spec.js          # TC-07 – TC-09, TC-26
└── playwright.config.js
```

## Test cases (26 total)

### Homepage (`home.spec.js`)

| ID | Test case |
|----|-----------|
| TC-10 | Homepage loads with correct title and URL |
| TC-11 | Key header elements visible (search, login, cart, language) |
| TC-12 | Guest cart badge is empty or zero |
| TC-13 | Logo navigates back to homepage from catalog |

### Login & language (`login.spec.js`)

| ID | Test case |
|----|-----------|
| TC-01 | Successful login with valid credentials |
| TC-02 | Multi-language UI (English/Sinhala) |
| TC-17 | Switch language to Sinhala and back to English |

### Authentication (`auth.spec.js`)

| ID | Test case |
|----|-----------|
| TC-14 | Login modal shows email and password fields |
| TC-15 | Invalid credentials do not log user in |
| TC-16 | Logout returns user to guest state |

### Search (`search.spec.js`)

| ID | Test case |
|----|-----------|
| TC-03 | Product search by keyword |
| TC-04 | Search auto-suggestion visibility |
| TC-05 | Price range filter (Min/Max) |
| TC-06 | Brand filter on search results |
| TC-18 | Search URL contains query parameter |
| TC-19 | Search results display product listing items |
| TC-20 | Invalid search shows zero results |
| TC-21 | Suggestion list includes typed keyword |
| TC-22 | Run consecutive searches with different keywords |

### Product details (`product.spec.js`)

| ID | Test case |
|----|-----------|
| TC-23 | Product page shows Add to Cart button |
| TC-24 | Navigating to product updates URL to `/products/` |
| TC-25 | Product page shows Buy Now button |

### Cart (`cart.spec.js`)

| ID | Test case |
|----|-----------|
| TC-07 | Add to cart and badge update |
| TC-08 | Cart persistence after reload |
| TC-09 | Remove item and badge update |
| TC-26 | Cart badge increases after adding another product |

Cart flows (TC-07–TC-09, TC-26) run in **serial** mode because they share cart state.

### Teaching: bad vs good (`NotAGoodPractice.spec.js`)

For **bootcamp / classroom use only**. This spec shows five common mistakes side by side with comments pointing to the correct pattern in this repo.

| Bad example | What to teach | Good counterpart |
|-------------|---------------|------------------|
| BAD-01 | Hardcoded URL, credentials, selectors | `LoginPage`, `data/users.json`, `playwright.config.js` baseURL |
| BAD-02 | Copy-pasted navigation in every test | `HomePage`, `SearchBar`, `data/products.json` |
| BAD-03 | One test covers login + search + cart | Split specs; `cart.spec.js` + page objects |
| BAD-04 | Magic numbers, `waitForTimeout`, weak asserts | `search.spec.js` TC-05, `ProductListingPage` |
| BAD-05 | Test depends on another test’s login | `auth.spec.js` TC-16, `beforeEach`, `auth.setup.js` |

Excluded from CI. Run for discussion only:

```bash
npx playwright test tests/specs/NotAGoodPractice.spec.js --project=chromium
```

Then compare with `tests/specs/login.spec.js` and `pages/user/LoginPage.js`.

### Manual / non-automatable

- Graphics quality (subjective visual check)
- Banner advertisement review

## Configuration

**Base URL:** `https://www.daraz.lk`

```bash
TEST_ENV=stag npx playwright test
```

Update `data/users.json` → `valid` object with your Daraz test account.

## Authentication setup

Cart tests use a saved login session (`tests/auth.setup.js` → `playwright/.auth/user.json`) so they do not conflict with logout tests running in parallel.

## Running tests

```bash
npm ci
npx playwright install --with-deps

npm test                  # all tests (setup + chromium + cart + firefox + webkit)
npm run test:chromium     # guest tests on chromium only
npm run test:cart         # cart tests with saved session

npm run test:home
npm run test:login
npm run test:auth
npm run test:search
npm run test:product
npm run test:cart

npm run report
```

## Page object flow

```
HomePage.open()
  → LoginPage.login() / loginWithInvalidCredentials()
  → AccountPage.logout()
  → SearchBar.search() / typeForSuggestions()
  → ProductListingPage.filterByBrand() / filterByPrice()
  → ProductDetailsPage.openProduct() / addToCart()
  → CartPage.expectProductInCart() / removeItem()
  → SettingsPage.switchLanguage()
```
# BootcampTeachingMaterial
