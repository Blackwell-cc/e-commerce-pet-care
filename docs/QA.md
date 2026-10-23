# Verification

Completed on 2026-10-23.

- `npm test`: 3 passing tests covering saved-cart validation, quantity changes and limits, immutable updates, integer money totals, and the free-shipping threshold.
- `npm run build`: successful production build with Vite 7.3.7.
- `git diff --check`: no whitespace errors.
- Browser checks: category filtering; adding products; quantity changes; free shipping; demo checkout totals; clearing the bag; product search and no-result feedback; routine finder; newsletter validation and completion; mobile navigation.
- Persistence: added The Good Bites, reloaded, and confirmed one item, $14 subtotal, $5 shipping, $19 total. Cleared the test bag afterward.
- Responsive layout inspected at 375px, 768px, and 1440px. Document width stayed within each viewport; key mobile headings/cards had no measured horizontal overflow. Tablet headline was adjusted to keep the dog's face clear.
- All six production images loaded. Browser console reported no errors or warnings on the final preview.
- Native modal dialogs provide Escape handling and focus containment. Focus is restored after changing bag quantities, including removing the final unit.
- Campaign and product images total about 300 KB in WebP format. Fonts are local and include license notices.

Screenshots: [desktop hero](screenshots/desktop.png), [desktop full page](screenshots/desktop-full.png), [mobile full page](screenshots/mobile.png).

This is a browser-tested portfolio frontend, not a production commerce backend. Actual payment, orders, inventory, tax, shipping, and email delivery are intentionally outside the demo. Cross-browser testing on physical Safari/Firefox devices has not been performed.
