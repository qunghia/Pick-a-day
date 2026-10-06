# Pick a Day ♡

A small mobile-first date invitation website inspired by a playful interactive date picker.

## Flow

1. Ask them out
2. Pick a date
3. Pick a time
4. Pick a plan
5. Show the final date summary

## Files

- `index.html`
- `style.css`
- `script.js`

## Customize

### Change the question

Open `index.html` and edit:

```html
will you go on a
<em>date with me?</em>
```

### Change time options

In `index.html`, edit the buttons with `data-time`.

### Change date ideas

Edit the buttons with `data-plan`.

For example:

```html
<button class="choice plan" data-plan="Pho">
  <span class="emoji">🍜</span><span>Pho</span>
</button>
```

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, and `script.js`.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/root`.
6. Save.
7. GitHub will generate your public link.

## Important

This starter version does **not** automatically send their choices back to you.

Their final choices appear on their screen so they can screenshot or copy them.

If you want the answer to be saved automatically, connect the site to Google Sheets through Google Apps Script or another small backend.
