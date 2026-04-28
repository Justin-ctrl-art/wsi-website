# How to update the WSI website

A 5-minute walkthrough for staff. No coding required.

---

## Once, on day one: log in

1. Go to **https://app.pagescms.org**
2. Click **"Sign in with GitHub"**
3. Use the WSI editor credentials (ask the office — they're stored in our password manager)
4. Approve the access prompt — this is one-time

After that, every time you visit `app.pagescms.org` you'll be logged in.

---

## The editor at a glance

When you open the project, you'll see four sections in the left sidebar:

| Section | What lives here |
|---|---|
| **Events** | Upcoming + past events that appear on the Events page and homepage |
| **Stories** | Survivor and clinician stories (on the Stories page + homepage preview) |
| **Team & Board** | Founder, team members, and board of directors |
| **Site Settings** | Top announcement ribbon, homepage hero, mission text, impact stats, contact info |

---

## Adding an event

1. Click **Events** in the sidebar
2. Click **"+ Add new"**
3. Fill in the form:
   - **Title** — e.g. *Whiskey Makes the Story Easier*
   - **Italic accent** *(optional)* — last words that should appear italic in gold (e.g. *the Story Easier.*)
   - **Slug** — short URL-friendly name, lowercase, dashes (e.g. `spring-benefit-2026`)
   - **Status** — choose **upcoming** or **past**
   - **Date** — pick from the date picker
   - **Start time / End time** — type as you'd say it (e.g. `5:30 PM`)
   - **Venue** — name, address, city, state, ZIP
   - **Hero Image** — drag-and-drop a photo (it'll be uploaded automatically)
   - **Opening paragraph** — the main description
   - **Second paragraph** *(optional)* — additional context
   - **RSVP / Detail page URL** — the link the "Event Details" button goes to
   - **Cost** — e.g. *By contribution* or *$150*
4. Click **Save**

Within ~45 seconds, the event appears on:
- The Events page
- The homepage event spotlight (if it's marked **upcoming**)

---

## Editing the announcement ribbon at the top

1. Click **Site Settings**
2. Scroll to **Top Announcement Ribbon**
3. Toggle **Show ribbon?** off if you want to hide it
4. Edit the message text and link
5. Click **Save**

---

## Adding a story

1. Click **Stories**
2. Click **"+ Add new"**
3. Fill in: category line, headline, excerpt, photo, author
4. Toggle **Show on homepage?** to feature it
5. Click **Save**

---

## Updating contact info / mailing address / phone

1. Click **Site Settings**
2. Scroll to **Contact Information**
3. Edit any field
4. Click **Save**

---

## What if I make a mistake?

Every save is a Git commit, so nothing is ever truly lost. If you publish something wrong:

- Easy fix: open the same item in Pages CMS, correct it, save again. Live in ~45 seconds.
- Total revert: ask your developer to roll back the commit. Takes about 1 minute.

---

## What I cannot edit (and who to ask)

These changes need a developer:
- Page layout or structure
- Brand colors or fonts
- Adding entirely new pages or sections
- Adding new fields to the editor

Email **[your dev contact]** for any of these. Most are 15 minutes of work.

---

## Tips

- **Images:** Use real photos when possible. The CMS will optimize them automatically. Suggested size: 1600px wide.
- **Copy length:** Headlines work best at 6–10 words. Excerpts at 20–30 words.
- **Dates:** Use the date picker, don't type free-form.
- **Preview before saving:** Open the live site in another tab (https://war-survivors-institute.vercel.app/events) and refresh after saving to see your change.
