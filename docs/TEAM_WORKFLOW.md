# AI-Time — Team Git Workflow (Direct on `master`)

> Simple flow: everyone works on **master**. Always **pull with rebase** before you start and before you push.

## 0) One-time setup

```bash
# Clone
git clone git@github.com:Remotework21/AI-Time.git
cd AI-Time

# Git settings
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global pull.rebase true        # use rebase for pulls
git config --global rerere.enabled true     # remember conflict resolutions
git config --global core.autocrlf true      # Windows: handle CRLF/LF

# Node deps
npm install
# Run (optional)
npm run dev
```

## 1) Every day before you start

```bash
git switch master
git pull --rebase origin master
npm install   # if package.json changed
```

## 2) While working

```bash
# edit files...
git add <files>
git commit -m "feat(scope): short description"
# make small, focused commits
```

## 3) Before pushing (keep history clean, avoid conflicts)

```bash
git fetch origin
git rebase origin/master     # put your commits on top of latest master
# if conflicts appear: fix files, then
git add <fixed-file>
git rebase --continue
```

## 4) Push to master

```bash
git push origin master
```

## 5) If your push is rejected

```bash
# someone pushed before you
git pull --rebase origin master
# fix any conflicts → add → rebase --continue
git push origin master
```

## 6) Quick conflict tips

* Open files with conflict markers `<<<<<<< ======= >>>>>>>`, keep the correct code.
* After fixing all conflicted files:

  ```bash
  git add <files>
  git rebase --continue
  ```
* At any time, to abort the rebase:

  ```bash
  git rebase --abort
  ```

## 7) Ignore files (already in repo)

* `.gitignore` excludes `node_modules/`, `dist/`, `.env`, logs, etc.
* Don’t commit real `.env`; use `.env.example`.

**Golden rule:** pull with rebase frequently, push only after a clean rebase.