# App Store (iOS) Release Checklist

A checklist for a first App Store release of a mobile app (native iOS or a cross-platform app such as KMP,
Flutter or React Native), built from a release that passed App Review.

Tags: **[Mac]** needs Xcode / a simulator / an iPhone · **[Console]** done by hand in App Store Connect,
Apple Developer or an SDK console · **[Code]** a change in the repo · `[if]` only when the app has that feature.

Vendor names below (Firebase, AdMob/UMP, RevenueCat) are examples of the usual stack; swap in your own.

---

## 1. Accounts and identity

- [ ] [Console] Apple Developer Program membership active; the team id written down for the Xcode config.
- [ ] [Console] App ID registered for the production bundle id. The dev bundle id (`<id>.dev`) can be left
      to Xcode's automatic signing on the first device run.
- [ ] [Code] Two targets: production (`<id>`, "App") and dev (`<id>.dev`, "App Dev"), so a dev build sits next
      to the store build on the same phone. Test targets follow the dev id (`<id>.dev.tests`, ...).
- [ ] [Console] App Store Connect app record created (name, primary language, bundle id, SKU).
- [ ] [Code] The record's numeric Apple ID put in the app config, so the in-app "Rate" / "Share" / "Update"
      links point to the store page (they should do nothing while it is empty, not crash).
- [ ] [Console] Firebase (or your analytics/crash SDK): one iOS app per bundle id, one
      `GoogleService-Info.plist` per target.
- [ ] [Console] `[if]` ads: AdMob iOS app and one unit per placement the Android app uses; app id in
      Info.plist, unit ids in a git-ignored config file with a committed `.template`.
- [ ] [Console] `[if]` ads: UMP consent messages cover the iOS app (EU regulations, US states, IDFA
      explainer).
- [ ] Privacy policy URL and support URL that name the app (and its store name, if it differs on iOS).

## 2. Xcode project and build

- [ ] [Mac] Deployment target decided (e.g. same minimum as your other iOS apps).
- [ ] [Mac] Info.plist / build settings:
  - `ITSAppUsesNonExemptEncryption` = `false` when the app only uses encryption provided by the OS (HTTPS,
    CryptoKit). Then App Store Connect asks no export compliance question per build.
  - `[if]` ads: `GADApplicationIdentifier`, `SKAdNetworkItems`, `NSUserTrackingUsageDescription`.
  - Launch screen, app category, `CADisableMinimumFrameDurationOnPhone` (ProMotion), analytics flags.
- [ ] [Mac] `PrivacyInfo.xcprivacy` added (data types collected, required-reason APIs). Keep
      `NSPrivacyTracking` false unless you also list tracking domains: iOS blocks those domains while ATT is
      denied, which can stop non-personalized ads too. The SDKs ship their own manifests.
- [ ] [Mac] App icon at 1024 px (Icon Composer `.icon` for Liquid Glass, or a 1024 px PNG); no Android
      adaptive padding.
- [ ] [Mac] Crash reporting: dSYM upload run script on non-Debug builds. If static SPM SDKs leave stub
      framework dylibs without dSYMs, generate them in a run script, or the upload warns "Upload Symbols
      Failed".
- [ ] [Code] Version: `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` match the Android version and
      versionCode (ideally set from the same git tag). App Store Connect refuses the same build number twice,
      so a fix after a rejection is a new patch version, not a re-upload.
- [ ] [Code] CI builds the app for the simulator (no signing) so iOS breaks are caught early.
- [ ] [Code] Cross-platform: every `expect` / platform interface has a real iOS implementation; compile the
      iOS target after shared-code changes (KMP compiles iOS Kotlin on Windows/Linux too).

## 3. Store-sensitive content (do this before anything else if it applies)

- [ ] `[if]` the app shows third-party IP (game, film, brand art): decide what must not ship on iOS. Keep the
      protected assets out of the iOS bundle and out of anything the iOS app downloads, not merely hidden.
- [ ] No feature flag or remote config value can change reviewed content after approval (e.g. turn the
      protected art back on). App Review treats remotely toggled content as hidden features.
- [ ] Remote Config / remote banners: give iOS its own values through a platform condition, so a banner image
      meant for Android never shows on iOS.
- [ ] A check before each upload that the archive holds none of the excluded files, e.g.
      `find build/App.xcarchive/Products/Applications/*.app -path '*<excluded-folder>/*' | wc -l` prints `0`.
- [ ] Cross-platform: no Android, Google Play or other platform names, badges or device images in the iOS app,
      its screenshots or its metadata (guideline 2.3.10). Shared code that says "Android" or links to Google Play
      (share text, "Rate us", update prompts) gets an iOS version.
- [ ] The app does more than show a website, and is not a near copy of another app on the store, yours included
      (guidelines 4.2 and 4.3).
- [ ] Nothing in the app or its metadata says beta, test, demo or "coming soon"; no placeholder text or dead
      buttons (guidelines 2.1 and 2.2).

## 4. Tests

- [ ] [Mac] Shared/unit tests run on the iOS simulator (not only on the JVM/Android): platform code such as
      crypto, file access and exception types can differ.
- [ ] [Mac] Smoke UI tests (XCUITest): launch, main lists, a detail screen, any special screen, language
      switch. Run from a fresh install.
- [ ] [Mac] By hand on a real iPhone (TestFlight build):
  - data from the bundle and from the network/CDN;
  - `[if]` ads: every placement with **test** units (never tap live ads);
  - `[if]` ads: consent form with the EEA debug geography, **then** the ATT prompt (ATT after consent);
  - `[if]` rewarded ads: the reward is granted;
  - analytics events visible in DebugView;
  - a deliberate test crash shows in the crash console with a symbolicated stack trace.
- [ ] [Mac] Also run it on an iPad and on an older, small iPhone (e.g. iPhone SE): App Review tests on them, and
      an iPhone-only app still runs on iPad (guideline 2.4.1). No crash, cut-off layout or button that does
      nothing; crashes and bugs found in review are the most common rejection (guideline 2.1).
- [ ] The Android app is still green (host tests, build, device tests) after the shared-code changes.

## 5. In-app purchases `[if]`

- [ ] [Console] Paid Applications agreement, bank and tax forms Active in App Store Connect (nothing can be
      sold without them).
- [ ] [Console] Products created (type, product id equal to Android's if you share code), display name,
      description, price, **availability per region** (a product with no availability blocks the submission).
- [ ] [Console] Each product has a **review screenshot** (the purchase screen) and **review notes**. A build
      must show the purchase screen to take that screenshot, so switch the sales flag on for a test build.
- [ ] [Console] Billing backend (e.g. RevenueCat): App Store app added with an In-App Purchase key, products
      on the entitlement and in the offerings; the `appl_` public key in the release config, a test-store key
      in the dev config.
- [ ] [Console] Remote flags that gate sales: the iOS value is `true` for the submission (review must be able
      to buy).
- [ ] [Mac] TestFlight + sandbox tester: purchase, pending payment (Ask to Buy), Restore Purchase after a
      reinstall, and the purchase's effect (e.g. ads gone).
- [ ] A visible **Restore Purchases** button for non-consumable products and subscriptions (guideline 3.1.1).
- [ ] `[if]` subscriptions: before the purchase, the screen shows the price, the billing period and what the user
      gets, with working links to the Terms of Use (EULA) and the privacy policy. App Store Connect also needs a
      Terms of Use link, in the description or the EULA field (guideline 3.1.2).
- [ ] The description says which features need a purchase or an ad (guideline 2.3.2).
- [ ] If two products sell the same thing (e.g. launch price and regular price) but only one shows at a time,
      say so in the review notes: review may look for both.
- [ ] First release: the products go into the **same submission** as the app version. In the current App
      Store Connect layout, "Add for Review" on each product puts it in a Draft Submission, and the version
      joins that draft. Edit product review notes before that: they lock inside a draft.
- [ ] Privacy policy names the App Store and the billing provider.

## 6. Privacy and legal

- [ ] [Console] App Privacy label ("nutrition label") entered **and published**; it matches
      `PrivacyInfo.xcprivacy` and the privacy policy. With ads: Device ID and Advertising Data used for
      tracking. Update it whenever data practices change.
- [ ] [Console] Age rating questionnaire answered (ads count; no UGC/web/chat if none) and the result checked
      against the Play rating.
- [ ] [Console] Export compliance: nothing to upload when `ITSAppUsesNonExemptEncryption` is `false` and all
      crypto comes from the OS.
- [ ] [Console] **Content Rights** (App Information): answer honestly whether the app contains third-party
      content. It is a legal statement in the account owner's name, so the owner answers it.
- [ ] [Console] **App Compliance** page: if the app is on sale in China mainland, items such as "Security
      Assessment" and "AI Generated or Synthetic Content" show "Missing Info". File them or remove China
      mainland from availability.
- [ ] [Console] `[if]` CallKit (VoIP calls, the system call screen; often pulled in by a calling or video SDK):
      China mainland's regulator (MIIT) asked for CallKit to be off in every app on the China App Store, so
      review rejects an app that has it while China mainland is in its availability (guideline 5). Remove China
      mainland in Pricing and Availability, or turn CallKit off for users in China, VoIP pushes included (iOS
      requires every VoIP push to report a call to CallKit). To see whether the binary links it:
      `otool -L <App>.app/<App> | grep CallKit`.
- [ ] Privacy policy link inside the app (e.g. Settings or About), not only in App Store Connect
      (guideline 5.1.1(i)).
- [ ] Every permission purpose string (`NS...UsageDescription`) says what the app does with the access, with an
      example, in each language the app supports; "This app needs camera access" is rejected. Ask for a
      permission only when the feature that needs it is used (guideline 5.1.1(ii)).
- [ ] `[if]` ads / tracking: when the App Privacy label declares tracking, review must see the ATT prompt; say in
      the Review Notes when it shows (e.g. after the consent form on first launch). No screen before it that copies
      the system alert or offers a reward for allowing (guideline 5.1.2).
- [ ] `[if]` sign-in: features that do not need an account work without signing in (guideline 5.1.1(v)).
- [ ] `[if]` sign-in with Google, Facebook, X or another third-party / social login for the main account: also
      offer an equal login option that collects only name and email, lets users hide their email and does not
      track them for ads without consent (guideline 4.8). Sign in with Apple meets all three. Not needed when the
      app only uses its own accounts, an existing school or company account, a government eID, or is a client for
      one third-party service (mail, a social network).
- [ ] `[if]` accounts: account deletion (guideline 5.1.1(v)):
  - started inside the app and easy to find (e.g. Settings → Account → Delete account); if it finishes on a
    website, link straight to that page;
  - deletes the account and its personal data; deactivating or disabling it is not enough;
  - no email, phone call or support chat to delete (only apps in highly regulated fields, such as banking, may
    use one); a confirmation or re-login step is fine;
  - with Sign in with Apple, revoke the user's tokens through the Sign in with Apple REST API;
  - with subscriptions, tell the user that billing continues through Apple until they cancel, and link to
    Manage Subscriptions;
  - guest accounts too; say how long deletion takes and what data is kept (only what the law requires).
- [ ] `[if]` user-generated content (posts, chat, profiles, uploads): a way to report content, block users,
      filter objectionable content, and contact info in the app (guideline 1.2).
- [ ] Third-party IP disclaimer in the app (About) and at the end of the store description.

## 7. Store listing

- [ ] [Console] Name, subtitle, keywords and category. No third-party trademarks in the name, subtitle or
      keywords.
- [ ] [Console] Description and promotional text; an "unofficial / not affiliated with" line when the app is
      about someone else's IP.
- [ ] [Console] Screenshots of the **real UI as shipped on iOS** for every size slot App Store Connect asks
      for (check "View All Sizes in Media Manager": several iPhone sizes and the iPad slot if the app runs on
      iPad). They show the app in use, not only the splash or sign-in screen (guideline 2.3.3). Drop any frame
      that is mostly third-party art.
- [ ] [Console] Support URL, marketing URL (your website: needed later for `app-ads.txt`), privacy policy URL.
- [ ] [Console] **Pricing and Availability** for the app itself (price, even Free, and regions). It is its
      own page under Distribution, not part of the version page, and is easy to miss.
- [ ] [Console] Review Notes: what the app is, no sign-in needed (or a demo account), anything review might
      question; contact info for App Review. Keep a reply ready for the likeliest rejection.
- [ ] [Console] `[if]` sign-in: the demo account works on the review build and does not expire, the backend stays
      on during review, and the notes say where to find account deletion, purchases and anything hard to reach. A
      short screen recording helps for flows review cannot reach on its own, such as hardware or a location
      (guideline 2.1).

## 8. Build, upload and submit

1. [ ] Check out the release tag/commit; clean build (`./gradlew clean` or equivalent).
2. [ ] Remote data the app needs is published (CDN/backend matches the bundle).
3. [ ] Release config present: live ad units, release billing key (without them the store build shows demo
       ads or cannot sell).
4. [ ] Tests green on the Mac (shared tests on simulator, smoke UI tests).
5. [ ] [Mac] Archive: scheme for production, destination *Any iOS Device (arm64)*, Release configuration
       (Xcode Product → Archive, or `xcodebuild archive`).
6. [ ] [Mac] Check the archive for excluded content (section 3).
7. [ ] [Mac] Upload: Organizer → Distribute App → App Store Connect.
8. [ ] [Mac] TestFlight: install on an iPhone and run the by-hand checks (section 4).
9. [ ] [Console] Before "Add for Review" (it refuses and names each missing item): app Pricing and
       Availability, Content Rights, screenshots, in-app purchases ready (availability, review screenshot,
       notes).
10. [ ] [Console] Pick the build, Add for Review, Submit. Choose **manual release** so you control go-live.

## 9. After approval / go-live

- [ ] [Console] Release the version by hand.
- [ ] [Console] Remote Config: set the iOS update-prompt values (minimum / latest version) to the App Store
      version, so older installs are asked to update.
- [ ] [Console] `[if]` ads: link the AdMob iOS app to the live App Store listing.
- [ ] [Console] `[if]` ads: AdMob finds `app-ads.txt` on the developer website named in the App Store listing.
- [ ] Watch crashes, analytics and reviews for the first days.

## Rejection traps to watch for

- **App completeness (guideline 2.1), the most common:** a crash, a dead button or a broken layout on the devices
  review uses (iPad, an older iPhone), a backend that is off, a demo account that does not sign in.
- **Login and accounts (4.8, 5.1.1(v)):** a social login with no privacy-friendly option next to it (Sign in with
  Apple), sign-in forced for features that need no account, no account deletion in the app, or deletion that only
  deactivates or asks for an email.
- **Other platforms in the iOS app (2.3.10):** "Android", a Google Play badge or link left in shared code, the
  screenshots or the description.
- **Permissions and ATT (5.1.1, 5.1.2):** vague purpose strings, tracking declared but no ATT prompt found.
- **Subscriptions (3.1.2):** price, period, Terms of Use or privacy links missing from the purchase screen.
- **Third-party IP (guideline 5.2.1):** protected assets kept out of the iOS app entirely, disclaimer in the
  description and in the app, no trademarks in name/keywords, screenshots without the protected art, a reply
  ready for review.
- **Hidden features:** no remote switch that changes reviewed content.
- **Purchase disclosure (2.3.2):** the description says what is paid or behind an ad.
- **Blockers that only show at "Add for Review":** Pricing and Availability, Content Rights, IAP availability,
  IAP review screenshots, China mainland compliance items.
- **Privacy mismatch:** App Privacy label, `PrivacyInfo.xcprivacy` and the privacy policy say the same thing.
- **CallKit in China (guideline 5):** an app with CallKit that is on sale in China mainland is rejected. Remove
  China mainland from availability or turn CallKit off there (section 6); if it is already off in China, reply
  to the review message in App Store Connect to confirm. VoIP calls stay allowed, only without CallKit's call
  screen.
