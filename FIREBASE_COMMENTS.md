# Article Comments Setup

Visitors comment on articles with an auto-generated anonymous nickname. There is
no sign-up, no password, and no email. Comments are stored in Firebase Firestore
so every visitor sees the same conversation.

Until the two config values below are filled in, comments fall back to the
visitor's own browser only — useful for local testing, but not shared.

## One-time Firebase setup

**1. Create the project**

Go to <https://console.firebase.google.com>, click **Add project**, name it
something like `cybercritters-comments`. Google Analytics is not needed — turn
it off.

**2. Create the database**

In the left sidebar: **Build → Firestore Database → Create database**. Choose
**Production mode** and pick the region closest to your readers
(`us-east1` for the US East Coast).

**3. Turn on anonymous sign-in**

In the left sidebar: **Build → Authentication → Get started → Anonymous →
Enable → Save**.

This is invisible to visitors — nobody sees a login screen. It exists so the
server can tell one browser from another and enforce "only the author may
delete this comment". Without it, anyone could delete anyone's comment.

**4. Copy the two config values**

Click the gear icon → **Project settings → General**. Scroll to **Your apps** and
click the web icon (`</>`) to register a web app (any nickname, no hosting
needed). You will be shown a snippet containing `projectId` and `apiKey`.

Put those two values in `site.js`, near the top:

```js
var COMMENTS_REMOTE_CONFIG = {
  projectId: "cybercritters-comments",
  apiKey: "AIza..."
};
```

The API key is not a secret — it identifies the project and is safe in public
client code. The security rules below are what actually protect the data.

**5. Paste the security rules**

**Firestore Database → Rules**, replace everything with this, then **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isModerator() {
      return request.auth != null
        && exists(/databases/$(database)/documents/moderators/$(request.auth.uid));
    }

    match /comments/{commentId} {
      // Anyone may read the conversation.
      allow read: if true;

      // Anyone signed in anonymously may post, but only as themselves,
      // and only with these five fields at sane lengths.
      allow create: if request.auth != null
        && request.resource.data.keys().hasOnly(
             ['articleId', 'author', 'authorKey', 'body', 'isoDate'])
        && request.resource.data.authorKey == request.auth.uid
        && request.resource.data.articleId is string
        && request.resource.data.articleId.size() > 0
        && request.resource.data.articleId.size() <= 100
        && request.resource.data.author is string
        && request.resource.data.author.size() > 0
        && request.resource.data.author.size() <= 60
        && request.resource.data.body is string
        && request.resource.data.body.size() > 0
        && request.resource.data.body.size() <= 1500
        && request.resource.data.isoDate is string
        && request.resource.data.isoDate.size() <= 40;

      // Comments are never edited after posting.
      allow update: if false;

      // Only the original author, or a listed moderator, may delete.
      allow delete: if request.auth != null
        && (request.auth.uid == resource.data.authorKey || isModerator());
    }

    match /moderators/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if false;  // add moderators from the console only
    }
  }
}
```

These rules are the real enforcement. The site also hides delete buttons a
visitor shouldn't see, but that is only convenience — someone bypassing the UI
still cannot delete another person's comment.

## Giving yourself moderator powers

A moderator can delete **any** comment, not just their own. This is granted per
browser, because anonymous visitors have no account to attach it to.

1. On the live site, unlock the admin console as usual (the blog password).
2. Open any article and scroll to the comments. While unlocked you will see
   **"Moderator ID for this browser: ..."** — copy that ID.
3. In the Firebase console: **Firestore Database → Start collection**, collection
   ID `moderators`, document ID = the ID you copied. Add any field at all
   (e.g. `name` = `"Sai"`) since Firestore needs one. Save.
4. Reload the article. You can now delete any comment; the menu reads
   **"Delete as admin"**.

Repeat for each person and each browser that needs to moderate. To revoke,
delete that document.

Note this is separate from the comment-delete permission every visitor already
has over their own comments — that needs no setup.

## What a visitor sees

- A nickname like `CuriousOtter4821`, generated on first visit and remembered in
  that browser. Roughly 3.6 million combinations.
- A `...` menu on their own comments only, containing **Delete**.
- No menu at all on anyone else's comments.

The nickname is per browser, not per person, so the same visitor on a phone and
a laptop will have two different names. That is unavoidable without accounts.

## Costs

Firestore's free tier covers 50,000 reads, 20,000 writes and 1 GiB of storage
per day. A comment section on a site this size will not come close. No billing
account is required to stay on the free tier.

## Turning the backend off

Blank out `projectId` and `apiKey` in `site.js`. Comments then live only in each
visitor's browser again. Nothing else needs to change.
