# Blog Publishing Setup

The blog now stores published articles and Iggy Tips in shared JSON files:

- `data/articles.json`
- `data/iggy-tips.json`

This makes posts visible to every visitor after the site is deployed.

## Admin Token

When an admin publishes or deletes a post, the site asks for a GitHub fine-grained token. Create the token in GitHub with:

- Repository access: `CyberCrittersCEO/CyberCrittersWebsite`
- Repository permissions: `Contents` set to `Read and write`

The site keeps the token only in the current browser tab's session storage. It is not saved in the repo.

## Editing Published Articles

After unlocking the admin console, each article shows an `Edit article` link. Any admin with the site password and a valid GitHub token can open an article, update the content, and save the changes back to the shared article file.

## Existing Browser-Only Posts

Posts that were published before this fix were saved only in the original publisher's browser. They need to be republished after this change is deployed so they can be written into the shared JSON files.
