# BuildBoard — Project Showcase & Feedback Board

A responsive student-project gallery built with HTML, CSS and vanilla JavaScript.

## Features
- Submit a project with author, category, description, tags and optional URL.
- Search across project titles, descriptions, authors, categories and tags.
- Filter by category and sort by newest or most upvoted.
- Upvote projects, with one vote per project per browser using localStorage.
- Add and view comments.
- Save projects in browser localStorage.
- Responsive layout for desktop and mobile.

## Run locally
1. Download or clone this repository.
2. Open `index.html` in a browser, or open the folder in VS Code and use Live Server.
3. No build step or package installation is required.

## Important limitations
This is a front-end prototype. Data is stored in the current browser, so it is not shared between users/devices and can be cleared by clearing browser data. The one-vote rule is client-side only and is not secure against deliberate manipulation. A production multi-user version would need a backend, database and server-side authentication/rate limiting.

## Files
- `index.html` — page structure
- `style.css` — visual design and responsive layout
- `script.js` — form handling, search, filtering, upvotes, comments and local storage
- `AUDIT.md` — portal audit template; complete it after testing the official GDG AITR portal

## Test checklist
- [ ] Submit a project with all required fields
- [ ] Try leaving required fields blank
- [ ] Search for a project by title and tag
- [ ] Filter by category
- [ ] Sort by newest and upvotes
- [ ] Upvote the same project twice
- [ ] Add a comment and reopen comments
- [ ] Refresh and check saved data
- [ ] Test at mobile width
- [ ] Verify project URLs open safely
