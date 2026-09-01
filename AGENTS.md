# Operating Rules

- GitHub `main` is the authoritative shared version of this project.
- Before beginning substantive work, fetch `origin main` and make sure the task is based on the current `origin/main`.
- Before pushing, fetch `origin main` again.
- Push to `main` only when the user explicitly asks you to push.
- When pushing directly to `main`, use the equivalent of `git push origin HEAD:main`.
- Never force-push.
- If a push would be non-fast-forward or there is any merge conflict, stop and tell the user rather than resolving it automatically.
- Avoid unnecessary file moves or renames.
- Keep changes focused on the requested task.
