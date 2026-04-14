# Playwright Test Notes

This document captures the browser coverage I used as the basis for the Playwright suite.

I kept the focus on the parts of the app that matter most for an end-to-end pass:

1. Start on the home page and enter a room count.
2. Fill out room dimensions.
3. Open the results modal and verify the calculation output.

## Test approach

A few implementation details shaped the test strategy:

- The app is a simple three-page flow, so the most valuable automation is around navigation, form submission, and result rendering.
- The results page does not render the calculation immediately. It waits for client-side JavaScript to call `/api/v1/calculate`, so the tests need to wait on the response and the populated cells instead of using a hard sleep.
- The footer text effectively acts as the published business rule, so I used that as the expected behavior for the defect-oriented scenarios.

## Coverage groups

I grouped the scenarios into three practical buckets:

- Smoke: confirm the main journey works and the app is usable.
- Validation/navigation: confirm required fields and direct URL behavior are handled sensibly.
- Spec/bug coverage: lock in the expected math and navigation rules even where the current app does not yet meet them.

## Cases automated or planned for automation

| ID | Area | What it proves | Expected outcome |
| --- | --- | --- | --- |
| PW-001 | Smoke | The home page loads with the expected controls | Heading, prompt, numeric input, and submit control are visible |
| PW-002 | Smoke | A valid room count advances the user to the next step | `/dimensions?rooms=2` loads successfully |
| PW-003 | Smoke | The dimensions form reflects the requested room count | The table shows one editable row per room |
| PW-004 | Validation | Room count is required before leaving the home page | Native browser validation blocks submission |
| PW-005 | Validation | Dimensions are required before posting the calculation | Blank dimension inputs block submission |
| PW-006 | Smoke | Valid dimensions reach the results page | The results page loads and exposes `View Results` |
| PW-007 | Smoke | The results modal is wired correctly | The modal opens with the expected heading and table |
| PW-008 | Regression | Calculation data is rendered after the API call completes | Room rows and total gallons are populated |
| PW-009 | Spec/bug | Single-room math follows the published formula | `10 x 12 x 8` should produce `352 ft` and `1 gallon` |
| PW-010 | Spec/bug | Multi-room totals round up per room, then sum | `5x6x7` and `6x7x8` should total `2 gallons` |
| PW-011 | Regression | The results modal can be dismissed cleanly | Closing the modal keeps the user on the results page |
| PW-012 | Spec/bug | The results-page Home action behaves like a restart | Clicking `Home` should return the user to `/` |
| PW-013 | Validation | Invalid direct navigation with `rooms=0` is rejected | The app should not render a zero-room dimensions screen |
| PW-014 | Validation | Invalid direct navigation with a negative value is rejected | The app should not silently convert `-2` into a valid request |
| PW-015 | Validation | Invalid direct navigation with a non-number is handled cleanly | The app should not surface a server error page |
| PW-016 | Regression | The published business rules remain visible through the flow | Footer copy is visible on home, dimensions, and results |
| PW-017 | Regression | The core journey still works on a mobile-sized viewport | The form flow and results modal remain usable |

## Suggested run order

If I were building this out from scratch again, I would still do it in this order:

1. `PW-001`, `PW-002`, `PW-006`, `PW-007`, `PW-008`
2. `PW-004`, `PW-005`, `PW-011`, `PW-016`, `PW-017`
3. `PW-009`, `PW-010`, `PW-012`, `PW-013`, `PW-014`, `PW-015`

That gets the core path under coverage first, then rounds out usability and validation, and finally adds the scenarios that currently expose known defects.

## Current gaps the tests intentionally highlight

These are not problems in the tests; they are the behaviors the tests are meant to surface:

- The API calculation does not currently match the formula described in the UI footer.
- Gallons are not rounded up the way the UI says they should be.
- The results page depends on delayed client-side rendering, so synchronization has to be handled carefully.
- The `Home` action on the results page does not currently return the user to the start of the flow.
- Direct navigation to `/dimensions` with invalid query values is not handled cleanly.
