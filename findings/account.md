# Account

The logged-in seller's account surfaces: the account menu in the site nav and
the profile page ("Profiilin muokkaus", `/user/edit`).

### ACC-01 · Saving the profile gives no sign that it worked
- **Status:** Open · **Type:** UX · **Severity:** Medium
- **Where:** Profile page, "Päivitä" under the contact details, and the password form's "Tallenna" / "Päivitä"
- **Found:** 2026-11-11, transcribing the profile page into the prototype
- **Evidence:** Both components toast `data.message` on success. `PATCH /user` answers with an empty array, so `useToastr(undefined)` shows nothing. The password endpoints answer with Fortify's default response, an empty body (Fortify's source, not in the dump), so the toast is skipped. The button is disabled only while the request runs; nothing else changes and the password fields keep what was typed.
- **Last checked:** prod dump 2026-11-05, still present
- **Next step:** A success toast on both, and clear the password fields after a save.
- **Touches:** the planned profile page changes

### ACC-02 · Profile details errors never appear on the fields
- **Status:** Open · **Type:** UX · **Severity:** Medium
- **Where:** Profile page, contact details, any failed "Päivitä"
- **Found:** 2026-11-11, transcribing the profile page
- **Evidence:** `UserDetails.vue`'s `getErrors` reads `props.errors`, a prop the component does not declare and nobody passes; the server's errors go to a local `errors` ref nothing reads. Only the summary toast shows ("Kenttä Etu- ja sukunimi on pakollinen. (ja 1 muuta virhettä)"), and no field turns red. The password form below does it right.
- **Last checked:** prod dump 2026-11-05, still present
- **Next step:** Read the local `errors` ref in `getErrors`, as `UpdatePassword.vue` does.
- **Touches:** the planned profile page changes

### ACC-03 · Emptying the phone number saves silently and keeps the old one
- **Status:** Open · **Type:** UX · **Severity:** Low
- **Where:** Profile page, Puhelinnumero emptied, then "Päivitä"
- **Found:** 2026-11-11, transcribing the profile page
- **Evidence:** `UpdateUserFormRequest::prepareForValidation` swaps an empty `telephone` for the saved one. The save succeeds, the field stays empty until the page is reloaded, and then the old number is back.
- **Last checked:** prod dump 2026-11-05, still present
- **Next step:** Decide whether the phone is required here; if it is, say so on the field.
- **Touches:** the planned profile page changes

### ACC-04 · After adding a password the page still offers to add one
- **Status:** Open · **Type:** UX · **Severity:** Low
- **Where:** Profile page, "Lisää salasana" section, after a successful "Tallenna"
- **Found:** 2026-11-11, transcribing the profile page
- **Evidence:** `UpdatePassword.vue` does not refresh `hasPassword` after a save, so the heading, the fields and the button stay in the add state until a reload refetches the user with `passwordDetails`.
- **Last checked:** prod dump 2026-11-05, still present
- **Next step:** Set `hasPassword` on success, together with ACC-01.
- **Touches:** the planned profile page changes

### ACC-05 · An unsaved invalid email blocks the password form without a message
- **Status:** Open · **Type:** Defect · **Severity:** Low
- **Where:** Profile page, the email field edited to something invalid and not saved, then the password form submitted
- **Found:** 2026-11-11, transcribing the profile page
- **Evidence:** The password form's hidden `type="email"` username input is bound to the same user object as the email field. The browser's own validation refuses to submit a form with an invalid control, and as the control is hidden it shows nothing; the button simply does nothing.
- **Last checked:** prod dump 2026-11-05, still present
- **Next step:** Bind the hidden input to the saved email, or make it `type="text"`.
- **Touches:** the planned profile page changes

### ACC-06 · Two password errors are untranslated or machine-translated
- **Status:** Open · **Type:** Copy · **Severity:** Medium
- **Where:** Profile page, password form errors (toast and under the fields)
- **Found:** 2026-11-11, transcribing the profile page
- **Evidence:** An empty current password gives "Kenttä current password vaaditaan." (no Finnish attribute name for `current_password` in `validation.php`). A short password gives "Salasana: n on oltava vähintään 8 merkkiä." (the `fi.json` translation of Fortify's length message).
- **Last checked:** prod dump 2026-11-05, still present
- **Next step:** Add `current_password` to the attributes and rewrite the length line in natural Finnish.
- **Touches:** the planned profile page changes

### ACC-07 · "Omat tarjouspyynnöt" uses a term the C2B terminology rules out
- **Status:** Open · **Type:** Copy · **Severity:** Low
- **Where:** Account menu, first item (desktop popover and phone drawer)
- **Found:** 2026-11-11, building the account menu
- **Evidence:** `app.menu.offers` is "Omat tarjouspyynnöt". The C2B terminology table names the seller's car "Myynti-ilmoitus" and rules out "Tarjouspyyntö". Prod keeps its own terms until the team changes them widely, so the prototype shows prod's word.
- **Last checked:** prod dump 2026-11-05, still present
- **Next step:** Include it when the team next changes the C2B terms in prod.
- **Touches:** terminology alignment

### ACC-08 · The name changes in the nav while it is typed, before any save
- **Status:** Open · **Type:** UX · **Severity:** Low
- **Where:** Profile page, Koko nimi field; the nav's first name and the name above the heading
- **Found:** 2026-11-11, transcribing the profile page
- **Evidence:** The fields are bound straight to the user store's object, so every keystroke renames the user in the header and the nav. An edit left unsaved stays in the nav while the seller moves around the app, until a reload.
- **Last checked:** prod dump 2026-11-05, still present
- **Next step:** Edit a copy of the user and write it back on a successful save.
- **Touches:** the planned profile page changes
