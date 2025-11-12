# Team Git Guide, Minimal Merge Pain

Goal: **Keep `master` stable**, move fast without PRs, and avoid merge conflicts.

---

## 0) One-Time Setup (everyone)

```bash
# Rebase when pulling (clean linear history)
git config --global pull.rebase true

# Auto-stash local edits before rebase/pull, then restore
git config --global rebase.autoStash true

# Clean removed remote branches locally
git config --global fetch.prune true

# Normalize line endings (important on Windows)
git config --global core.autocrlf input
```

**Ignore junk:** add a `.gitignore` with at least:

```
node_modules
dist
.build
.vercel
.env
.env.*
```

---

## 1) Daily Start (sync first, code second)

```bash
git switch master
git pull --rebase --autostash origin master
npm ci   # or: npm install
```

If your local copy is messy and you want a hard reset (⚠️ discards local changes):

```bash
git fetch origin
git switch master
git reset --hard origin/master
git clean -fd
npm ci
```

---

## 1.5) **When exactly should I pull? (Important)**

**Short answer:**

* **Pull first** before you start coding.
* **Pull again** right **before you push** (to land your commits on top of the latest `master`).

### Why?

* Pulling first reduces conflicts because you start from the latest code.
* Pulling again before pushing ensures your work is **rebased on top** of the newest `master`, so your push is fast-forward and conflict-free.

### What if I already started coding?

* If you’ve **committed** your changes: just run

  ```bash
  git pull --rebase origin master
  ```
* If you have **uncommitted** changes: run

  ```bash
  git pull --rebase --autostash origin master
  ```

  This temporarily stashes your edits, updates your branch, then restores your edits.

### Minimal routine you can memorize

```bash
# Start of day
git pull --rebase --autostash origin master

# ...code, commit...

# Before pushing
git pull --rebase --autostash origin master
git push origin master
```

---

## 2) Normal Work

You can work **directly on `master`** (fastest but riskier) or use **short-lived feature branches** then push straight. Pick one policy and stick to it.

### A) Work directly on `master`

```bash
# Always sync first
git pull --rebase --autostash origin master

# Edit files...
git add .
git commit -m "feat(scope): clear message"

# Optional sanity check
npm run build

# Sync again → then push
git pull --rebase --autostash origin master
git push origin master
```

If push is rejected (someone pushed before you):

```bash
git pull --rebase --autostash origin master
# resolve conflicts → git add <file> → git rebase --continue
git push origin master
```

### B) Short-lived feature branch

```bash
git pull --rebase --autostash origin master
git checkout -b feat/<task>

# work → commit small
git add .
git commit -m "feat(scope): message"

# put your commits on top of latest master
git fetch origin
git rebase origin/master
# fix conflicts → git add <file> → git rebase --continue

# fast-forward merge to master locally (no PR)
git switch master
git pull --rebase --autostash origin master
git merge --ff-only feat/<task>
git push origin master

# clean up
git branch -d feat/<task>
git push origin :feat/<task>  # optional
```

> **Never** use `--force` on `master`. If you rewrote history on your *own* feature branch, use `git push --force-with-lease` **only on that branch**, never on `master`.

---

## 3) Quick Hotfix on `master` (allowed, but sync first)

```bash
git switch master
git pull --rebase --autostash origin master

# apply the fix
git add <files>
git commit -m "fix: short description"
npm run build   # optional but recommended

# sync again, then push
git pull --rebase --autostash origin master
git push origin master
```

If push is rejected:

```bash
git pull --rebase --autostash origin master
# resolve → add → rebase --continue
git push origin master
```

---

## 4) When You Hit a Merge Conflict (do this)

### During `pull --rebase` or `rebase`

1. Git stops and marks conflicted files with:

```
<<<<<<< HEAD
your version
=======
incoming version
>>>>>>> origin/master
```

2. Choose what to keep:

* Keep **your local** version for a file:

  ```bash
  git checkout --ours path/to/file
  ```
* Keep **remote** version for a file:

  ```bash
  git checkout --theirs path/to/file
  ```
* Or edit manually to combine.

3. Mark resolved & continue:

```bash
git add path/to/file
git rebase --continue
```

4. Stuck?

```bash
git rebase --abort   # go back to pre-rebase state
```

### You pulled, no conflict markers, but a file turned “wrong”

* If you had **commits** with the correct version:

  ```bash
  git log -- path/to/file
  git checkout <commit_sha> -- path/to/file
  git add path/to/file
  git commit -m "fix: restore correct version"
  ```
* If you had **uncommitted** changes and didn’t use `--autostash`:

  * Try IDE **Local History/Timeline** (VS Code/JetBrains), or reapply manually.
  * Commit, then continue as normal.

---

## 5) Team Rules That Prevent Conflicts

1. **Sync before you start and before you push:**

   ```bash
   git pull --rebase --autostash origin master
   ```
2. **Small, focused commits** with clear messages.
3. **Communicate**: if two people touch the same file/area, coordinate who pushes first.
4. **Build locally** before pushing:

   ```bash
   npm run build
   ```
5. Case-sensitive names: keep file names and imports identical in case (`Products.css` ≠ `products.css`).
6. Use a formatter (Prettier) and pre-commit hook (Husky) so formatting doesn’t create noisy diffs.
7. Consider a simple `.gitattributes` to normalize text:

   ```
   * text=auto
   ```

---

## 6) Quick Cheatsheet

* Start of day:

  ```bash
  git pull --rebase --autostash origin master
  ```
* Before pushing:

  ```bash
  git pull --rebase --autostash origin master
  git push origin master
  ```
* Abort a messy rebase:

  ```bash
  git rebase --abort
  ```
* Start over from remote (⚠️ destructive):

  ```bash
  git fetch origin
  git switch master
  git reset --hard origin/master
  git clean -fd
  ```
* After rebase on **your branch** only:

  ```bash
  git push --force-with-lease
  ```

---

**Bottom line:** Pull first, code and commit in small steps, pull again before pushing, resolve conflicts cleanly with `ours/theirs`, and never force-push `master`.
