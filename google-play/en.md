# Google Play (Android) Release Checklist

A checklist for a first Google Play release of an Android app (native, or a cross-platform app such as KMP,
Flutter or React Native), built from the release checklist we use for apps live on Google Play.

Tags: **[Device]** needs a real Android device · **[Console]** done by hand in Play Console or an SDK console ·
**[Code]** a change in the repo · `[if]` only when the app has that feature.

Vendor names below (Firebase, AdMob/UMP, RevenueCat) are examples of the usual stack; swap in your own.

---

## 1. Accounts and identity

- [ ] [Console] Play Console account in good standing; the developer name matches the privacy policy and the
      website.
- [ ] [Console] **Personal** accounts created after November 13, 2023 must run a closed test with at least 12 testers
      opted in for 14 days in a row before they can apply for production (details under "Traps to watch for"). Plan
      for it early: it is the longest wait.
- [ ] [Code] Application id (`<id>`) final: it can never change after release.
- [ ] [Code] Debug/dev builds install as `<id>.dev` (`applicationIdSuffix`, "App Dev" name), so they sit next to
      the store build on the same phone.
- [ ] [Console] Firebase (or your analytics/crash SDK): one Android app per application id, one
      `google-services.json` per variant.
- [ ] [Console] `[if]` ads: an Android app on AdMob and one ad unit per placement.
- [ ] Developer website and support email live (they also host the privacy policy and `app-ads.txt`).

## 2. Build, signing and versioning

- [ ] Upload key outside the repo and safely backed up; **Play App Signing** enrolled.
- [ ] [Console] **Android developer verification**: register **every** key of the package, not just the package.
      Linking Firebase App Distribution to Play (to distribute AABs) adds an internal app sharing key; until it is
      registered, Play rejects every listing change and release, in the Console and through the API.
- [ ] [Code] versionName / versionCode derived from git tags, never hardcoded; versionCode strictly increasing.
- [ ] [Code] Ship an **AAB** to Play (APKs only for direct testing).
- [ ] [Code] R8 / minify on for release; keep rules for reflection, serialization and SDKs.
- [ ] [Code] R8 mapping uploaded to Play and to Crashlytics (through its Gradle plugin), so stack traces are readable.
- [ ] [Code] `[if]` native code (NDK, Unity IL2CPP): debug symbols inside the AAB and uploaded to Crashlytics for
      each release. Symbols match only the build they came from.
- [ ] [Code] targetSdk meets Play's current target API requirement (the deadline usually moves every August);
      minSdk chosen on purpose.
- [ ] [Code] Backup decided on purpose: `android:allowBackup` / data-extraction rules, so user data survives a new
      phone or a reinstall unless dropping it is intended.
- [ ] [Code] CI builds the signed AAB from a git tag; secrets in CI secrets, documented in the README.
- [ ] Release built after `clean`; no debug flags, test ad ids or staging URLs left.

## 3. Release-build testing

- [ ] [Device] Install **the exact release (R8) build** on a real device and walk every screen. Debug builds skip
      R8, so they hide the crashes only R8 causes (a missing keep rule is the usual one).
- [ ] [Device] Test on a minSdk device and on the latest Android.
- [ ] [Device] Cold start, process death and restore, no network, slow network.
- [ ] [Device] Dark mode, large font scale, small and large screens (tablet / foldable layout holds).
- [ ] [Device] `[if]` devices without Google Play services: the app still starts (Firebase / ads calls guarded).
- [ ] [Device] `[if]` several languages: no truncated or untranslated strings.
- [ ] [Console] Read the **Pre-launch report** Play runs on every uploaded build, test builds included
      (stability, compatibility, performance, accessibility).
- [ ] [Device] `[if]` replacing an older app on the same listing: install the old store build, update to the new
      one through Play (internal track), the app starts, old data migrated or dropped on purpose.

## 4. Monitoring after release

- [ ] [Code] Crash reporting (e.g. Firebase Crashlytics): collection off in debug builds; a test crash on the
      release build shows in the console with a readable stack trace (mapping uploaded).
- [ ] [Code] Caught-but-unexpected errors (data updates, consent, payments) recorded as non-fatals.
- [ ] [Code] Analytics: event catalog in code and documented; every screen and key action has a tracking decision;
      checked in DebugView.
- [ ] Know Play vitals' bad-behavior thresholds (user-perceived crash rate 1.09%, ANR 0.47%) and who watches them
      after release.
- [ ] `[if]` CI reports builds and Play uploads to chat (Discord, Slack...).

## 5. Remote control and updates

- [ ] [Code] Remote Config with in-app defaults: the app behaves correctly with no network and before the first
      fetch. Values published in the console.
- [ ] [Code] Update path: Play in-app updates (immediate for required versions, flexible otherwise) driven
      remotely, so users can be moved off a bad release.
- [ ] [Code] `[if]` kill switches for risky features (ads, remote data, new flows).
- [ ] [Code] `[if]` remote data / CDN: versioned files, published files never edited, rollback documented.

## 6. Privacy and policy

- [ ] Privacy policy at a stable URL, reachable inside the app, listing every SDK that collects data (analytics,
      crashes, ads, remote config, push...).
- [ ] [Console] **Data safety** form matches the code, the privacy policy **and** each SDK's own disclosure. Usual
      mistakes: the ads SDK "shares" data by its own disclosure; approximate location derived from the IP; device
      IDs used for analytics too; data that never leaves the device needs no declaration.
- [ ] [Console] Content rating (IARC) questionnaire answered.
- [ ] [Console] Target audience and content: the right age groups; if children are included, the Families policy
      applies.
- [ ] [Console] "Contains ads" declared truthfully.
- [ ] [Console] App access: if sign-in is needed, credentials and instructions for the reviewer. The account works
      on the submitted build and does not expire; the backend stays on during review.
- [ ] `[if]` accounts: account deletion, both ways:
  - inside the app, easy to find;
  - a web page where people can ask to delete their account and its data without reinstalling the app, entered
    in the Data safety form. Review opens it from outside the app;
  - deleting means deleting: deactivating or freezing the account is not enough. An extra option to delete only
    some data is fine on top.
- [ ] `[if]` sensitive permissions (notifications, exact alarms, location, photos/videos, foreground service types):
      declared in the Console with a clear reason, requested only when needed.
- [ ] [Code] Check the **merged manifest** (Android Studio's Merged Manifest tab, or the release build's
      `AndroidManifest.xml` inside the AAB) for permissions a library added, e.g. `READ_MEDIA_IMAGES`, location or
      `QUERY_ALL_PACKAGES`. Remove the ones the app does not use with `tools:node="remove"`; an undeclared one is
      rejected.
- [ ] `[if]` photos / videos: `READ_MEDIA_IMAGES` / `READ_MEDIA_VIDEO` only when broad media access is the app's
      core purpose (a gallery, an editor); otherwise use the system photo picker, which needs no permission.
- [ ] [Console] `[if]` restricted permissions (SMS, call log, all files access, package visibility, background
      location...): the Permissions Declaration Form, often with a short video of the feature. Review can take
      weeks, so file it early.
- [ ] `[if]` user-generated content (posts, chat, profiles, uploads): a way to report content and block users, plus
      moderation.
- [ ] The app does more than show a website, and is not a near copy of another app on Play, yours included (spam and
      minimum functionality policy).
- [ ] [Console] `[if]` policy declarations that apply: financial features, news, health, government, gambling.
- [ ] `[if]` third-party IP (unofficial / fan apps): disclaimer in the listing and in the app, no one else's
      trademarks in the name or icon.

## 7. Monetization `[if]`

- [ ] [Code] Ads: production ad unit ids only in the release build; debug builds use test ids / test devices.
- [ ] [Console] Consent: UMP messages for the EU and US states published in AdMob; a Privacy options entry in the
      app; ads (and analytics where required) wait for consent.
- [ ] [Console] `app-ads.txt` on the developer website; AdMob app linked to the Play listing and to Firebase;
      maximum ad content rating set.
- [ ] [Console] Rewarded ads: an AdMob frequency cap above the app's own limit, as a backstop that never cuts an
      ad the app offered.
- [ ] [Console] In-app purchases: payments profile set up; products (one-time / subscription) priced and available
      in their regions; license testers listed.
- [ ] [Device] Test purchase, pending payment, refund and "restore purchases" after a reinstall, on a
      **release-signed** build with the real application id: the `.dev` id has no products.
- [ ] [Console] Billing backend (e.g. RevenueCat): a service account with the needed Play Console permissions,
      Real-time developer notifications through Pub/Sub, and the **Google Play Android Developer API enabled** in
      the Cloud project (without it the credentials check fails even with every permission granted).
- [ ] [Console] Data safety declares purchase history when the app sells anything.
- [ ] `[if]` subscriptions: the purchase screen shows the price, the billing period, what the user gets and how to
      cancel, as clearly as the button itself (Play subscriptions policy).
- [ ] [Code] Prompts that open on their own at launch (update, consent, onboarding) run one at a time, never stacked.

## 8. Store listing

- [ ] [Console] App name (up to 30 characters), short description (80), full description (4000), category,
      contact email, website, privacy policy URL.
- [ ] [Console] Metadata policy: no "best", "#1", "top", "free" or price claims, no emoji, ALL CAPS or repeated
      keywords in the name, icon or short description; no other apps' or brands' names; no ranking badges or
      "new" labels on the icon.
- [ ] [Console] Icon 512 × 512 px, feature graphic 1024 × 500 px, phone screenshots; tablet screenshots when the
      app supports tablets. Screenshots show the app in use, not only the splash or sign-in screen.
- [ ] [Console] Localized listings for the main markets.
- [ ] [Console] Release notes for every listing language.

## 9. Release

1. [ ] Check out the release tag; clean build; CI builds the signed AAB.
2. [ ] [Console] Upload to **internal testing** first: install from Play (not a sideloaded file) and rerun the
       by-hand checks of section 3.
3. [ ] [Console] `[if]` new personal account: the closed test with enough testers for enough days (section 1),
       then apply for production access.
4. [ ] [Console] Dashboard and **Policy → App content** show nothing missing (Data safety, content rating,
       target audience, ads, app access...). On **Publishing overview**, send the changes for review; turn on
       **Managed publishing** there to choose when an approved release goes live.
5. [ ] [Console] Promote to **production** with a staged rollout (e.g. 10% → 50% → 100%) for updates. A new
       app's first review can take several days.

## 10. After going live

- [ ] First 72 hours: watch crashes, Play vitals and analytics; **halt the rollout** on a crash spike.
- [ ] [Console] Remote Config: update the minimum / latest versions for the update prompt.
- [ ] [Console] `[if]` ads: AdMob finds `app-ads.txt` and is linked to the listing.
- [ ] Reply to reviews; track the rating.

## Traps to watch for

- **The 12-tester / 14-day closed test (personal accounts created after November 13, 2023):** production access
  stays closed until it is done. At least 12 testers must have been opted in for the 14 days right before you
  apply, so recruit a few extra in case some leave. Then click "Apply for production" on the Dashboard and answer
  questions about the test, the app and its readiness; Google usually reviews it within about 7 days. Put these
  three weeks or so in the plan from the start.
- **Unregistered key (developer verification):** an internal app sharing key created by linking Firebase App
  Distribution made Play reject every release and listing change until it was registered.
- **Crashes only in the R8 build:** the debug build was fine, the release build crashed on a missing keep rule.
  Always test the exact release build before shipping it.
- **Data safety out of line with an SDK:** declaring "no data shared" while the ads SDK discloses that it shares.
- **Billing backend reports bad credentials:** the Google Play Android Developer API was off in the Cloud project;
  permissions were fine.
- **Testing purchases on a debug build:** the `.dev` application id has no products; test on a release-signed build.
- **Account deletion with no web link:** deletion inside the app is not enough; Play also needs a web page, entered
  in the Data safety form, where people can ask for deletion without the app.
- **A permission a library added:** a dependency can put a sensitive permission into the merged manifest; Play
  rejects it when the app does not use or declare it.
- **Metadata:** "best", "#1", emoji or repeated keywords in the name or short description.
