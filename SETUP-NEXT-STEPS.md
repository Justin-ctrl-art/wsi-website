# Setup — Final Steps (Justin: ~15 minutes of clicks)

Everything that can be automated is done. The local code is ready and committed. These are the auth-required clicks I cannot do for you, in order. Each step is one URL + a couple of clicks.

---

## Step 1 — Create the WSI GitHub account *(or use an existing one)* — ~3 min

If WSI already has a GitHub account, skip this.

1. Go to **https://github.com/signup**
2. Email: use a shared inbox like `web@warsurvivors.org` or `admin@warsurvivors.org` (recommended) — or your own email
3. Username suggestion: `warsurvivors-institute` or `wsi-web`
4. Verify the email
5. Done — no plan upgrade needed; the free tier is fine

---

## Step 2 — Create an empty GitHub repo — ~1 min

1. Go to **https://github.com/new**
2. Repository name: `wsi-website`
3. Visibility: **Public** (easier — Pages CMS works seamlessly with public repos on the free tier). Choose Private only if you want to spend $4/mo on the GitHub Team plan.
4. ⚠️ Leave all checkboxes unchecked (no README, no .gitignore, no license — we already have those)
5. Click **Create repository**
6. Copy the repo URL shown on the next page (it'll look like `https://github.com/your-username/wsi-website.git`) — paste it to me and I'll do step 3.

---

## Step 3 — Push the code (I do this for you, once you give me the URL) — ~30 sec

After you paste me the GitHub repo URL, I'll run two commands locally:

```bash
git remote add origin https://github.com/<you>/wsi-website.git
git push -u origin main
```

The code lands in your repo immediately.

---

## Step 4 — Connect Vercel to the GitHub repo — ~3 min

This replaces the current "deploy from Justin's laptop" with "deploy from GitHub" — meaning every commit (including ones from Pages CMS) automatically rebuilds the site.

1. Go to **https://vercel.com/justin-kasietas-projects/war-survivors-institute/settings/git**
2. Click **"Connect Git Repository"**
3. Choose **GitHub** → authorize Vercel if prompted
4. Pick the `wsi-website` repo
5. Branch: `main`
6. Click **Connect**

Vercel will trigger a deploy from the repo within seconds. From now on, any commit auto-deploys.

---

## Step 5 — Set up Pages CMS — ~5 min

1. Go to **https://app.pagescms.org**
2. Click **"Sign in with GitHub"** → use the WSI account from Step 1
3. Approve the access prompt (Pages CMS needs to read your repos)
4. On the project list, click **"+ Add project"**
5. Pick the `wsi-website` repo from the dropdown
6. Pages CMS reads `.pages.yml` automatically and shows the editor with: **Events · Stories · Team & Board · Site Settings**
7. Try it: click **Events**, click the existing Whiskey event, change a word, hit **Save**
8. Within 60 seconds, your change is live at https://war-survivors-institute.vercel.app

---

## Step 6 — Add staff editors — ~2 min

For each person who needs to edit the site:

1. Either:
   - **Easiest:** share the WSI GitHub login credentials (one shared account)
   - **Better long-term:** invite each person as a collaborator on the GitHub repo (Settings → Collaborators → Add people). They each create their own free GitHub account.
2. They visit https://app.pagescms.org, sign in with GitHub, and see the editor.

---

## What you have when this is done

- ✅ Your site lives on Vercel at https://war-survivors-institute.vercel.app (and any custom domain you point at it)
- ✅ Source of truth is GitHub repo `wsi-website` — full version history of every edit
- ✅ Staff log in at https://app.pagescms.org and edit Events / Stories / Team / Site Settings via simple forms
- ✅ Every save → automatic GitHub commit → automatic Vercel rebuild → live in ~45 sec
- ✅ Zero monthly cost (Vercel free + GitHub free + Pages CMS free)
- ✅ I can keep editing code (design, layout, new sections) in parallel without breaking staff edits

---

## When you hit a snag

The most common stumbles, in order of likelihood:

1. **Vercel can't find the repo** — usually means you authorized Vercel only for personal repos, not org repos. Re-authorize and grant access to the `wsi-website` repo specifically.
2. **Pages CMS shows "schema invalid"** — `.pages.yml` got malformed. Tell me; I'll fix in 1 minute.
3. **Editor saves but site doesn't update** — Vercel webhook didn't fire. Check Vercel dashboard → Deployments → look for a recent build. Usually it just takes 60 sec.
4. **Editor wants to edit something not in the form** — that's a 15-minute dev task. Tell me what field and I'll add it.

---

**Total time on your end: ~15 minutes spread across these 6 steps.**

When you're ready, paste me the GitHub repo URL from Step 2 and I'll handle Step 3 immediately.
