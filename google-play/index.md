# Checklist release Google Play (Android)

**Tiếng Việt** · [English](en.md)

Checklist cho lần đầu đưa một app Android lên Google Play (app native, hoặc app đa nền tảng như KMP, Flutter,
React Native). Checklist được rút ra từ checklist release chúng tôi dùng cho các app đang chạy trên Google Play.

Nhãn: **[Device]** cần một máy Android thật · **[Console]** làm tay trên Play Console hoặc console của SDK ·
**[Code]** sửa trong repo · `[if]` chỉ áp dụng khi app có tính năng đó.

Tên vendor bên dưới (Firebase, AdMob/UMP, RevenueCat) chỉ là ví dụ của stack hay dùng; thay bằng stack của bạn.

---

## 1. Tài khoản và định danh

- [ ] [Console] Tài khoản Play Console còn hiệu lực; tên developer khớp với privacy policy và website.
- [ ] [Console] Tài khoản **cá nhân** mới phải chạy closed test với ít nhất 12 tester trong 14 ngày liền trước khi
      được mở production. Lên kế hoạch sớm, vì đây là bước chờ dài nhất.
- [ ] [Code] Chốt application id (`<id>`): sau khi phát hành thì không bao giờ đổi được.
- [ ] [Code] Bản debug/dev cài dưới `<id>.dev` (`applicationIdSuffix`, tên "App Dev"), để nằm cạnh bản store trên
      cùng một máy.
- [ ] [Console] Firebase (hoặc SDK analytics/crash của bạn): mỗi application id một app Android, mỗi variant một
      file `google-services.json`.
- [ ] [Console] `[if]` có quảng cáo: app Android trên AdMob và mỗi placement một ad unit.
- [ ] Website developer và email hỗ trợ đang hoạt động (cũng là nơi đặt privacy policy và `app-ads.txt`).

## 2. Build, ký app và version

- [ ] Upload key nằm ngoài repo, có bản backup an toàn; đã bật **Play App Signing**.
- [ ] [Console] **Android developer verification**: đăng ký đủ **mọi** key của package, không chỉ package. Liên kết
      Firebase App Distribution với Play (để phát AAB) sẽ tạo thêm một key internal app sharing; key đó chưa được
      đăng ký thì Play từ chối mọi thay đổi listing và mọi release, cả trên Console lẫn qua API.
- [ ] [Code] versionName / versionCode lấy từ git tag, không hardcode; versionCode luôn tăng.
- [ ] [Code] Build ra **AAB** cho Play (APK chỉ để test trực tiếp).
- [ ] [Code] Bật R8 / minify cho release; có keep rule cho reflection, serialization và các SDK.
- [ ] [Code] File mapping R8 được upload lên Play và lên Crashlytics (qua Gradle plugin), để stack trace đọc được.
- [ ] [Code] `[if]` có native code (NDK, Unity IL2CPP): debug symbols nằm trong AAB và được upload lên Crashlytics
      cho từng bản. Symbols chỉ khớp với đúng build tạo ra chúng.
- [ ] [Code] targetSdk đạt yêu cầu target API hiện tại của Play (mốc thường dời lên mỗi tháng 8); minSdk được chọn
      có chủ đích.
- [ ] [Code] Chốt chuyện backup: `android:allowBackup` / data-extraction rules, để dữ liệu người dùng còn khi đổi máy
      hoặc cài lại, trừ khi cố ý bỏ.
- [ ] [Code] CI build AAB đã ký từ git tag; secret nằm trong CI secrets và có ghi trong README.
- [ ] Bản release build sau `clean`; không còn debug flag, test ad id hay URL staging.

## 3. Test bản release

- [ ] [Device] Cài **đúng bản release (đã qua R8)** lên máy thật và đi qua mọi màn hình. Bản debug bỏ qua R8 nên
      không lộ các crash chỉ R8 mới gây ra (thiếu keep rule là lỗi hay gặp nhất).
- [ ] [Device] Test trên máy minSdk và trên Android mới nhất.
- [ ] [Device] Mở lạnh, process bị kill rồi khôi phục, không có mạng, mạng chậm.
- [ ] [Device] Dark mode, cỡ chữ lớn, màn nhỏ và màn lớn (tablet / foldable không vỡ layout).
- [ ] [Device] `[if]` máy không có Google Play services: app vẫn mở được (các lời gọi Firebase / ads có bảo vệ).
- [ ] [Device] `[if]` nhiều ngôn ngữ: không có chuỗi bị cắt hay chưa dịch.
- [ ] [Console] Đọc **Pre-launch report** mà Play tự chạy trên bản upload lên track test (crash, accessibility,
      cảnh báo bảo mật).
- [ ] [Device] `[if]` thay thế một app cũ trên cùng listing: cài bản store cũ, cập nhật lên bản mới qua Play
      (internal track), app mở được, dữ liệu cũ được chuyển hoặc bỏ có chủ đích.

## 4. Theo dõi sau khi phát hành

- [ ] [Code] Crash reporting (ví dụ Firebase Crashlytics): tắt thu thập ở bản debug; một crash thử trên bản release
      hiện trong console với stack trace đọc được (mapping đã upload).
- [ ] [Code] Lỗi bắt được nhưng bất thường (cập nhật dữ liệu, consent, thanh toán) được ghi thành non-fatal.
- [ ] [Code] Analytics: danh mục event trong code và có tài liệu; mỗi màn hình và hành động chính đều có quyết định
      tracking; đã kiểm tra trong DebugView.
- [ ] Biết ngưỡng "bad behavior" của Play vitals (user-perceived crash rate 1,09%, ANR 0,47%) và ai sẽ theo dõi
      sau khi phát hành.
- [ ] `[if]` CI báo kết quả build và upload lên Play qua chat (Discord, Slack...).

## 5. Điều khiển từ xa và cập nhật

- [ ] [Code] Remote Config có giá trị mặc định trong app: app chạy đúng khi không có mạng và trước lần fetch đầu.
      Các giá trị đã publish trên console.
- [ ] [Code] Đường cập nhật: Play in-app updates (immediate cho bản bắt buộc, flexible cho bản thường) điều khiển
      từ xa, để đẩy được người dùng khỏi một bản lỗi.
- [ ] [Code] `[if]` kill switch cho tính năng rủi ro (ads, dữ liệu từ xa, flow mới).
- [ ] [Code] `[if]` dữ liệu từ xa / CDN: file có version, không sửa file đã phát hành, có cách rollback.

## 6. Quyền riêng tư và chính sách

- [ ] Privacy policy ở một URL ổn định, mở được từ trong app, liệt kê mọi SDK thu thập dữ liệu (analytics, crash,
      ads, remote config, push...).
- [ ] [Console] Form **Data safety** khớp với code, với privacy policy **và** với công bố của từng SDK. Những chỗ
      hay sai: SDK quảng cáo có "chia sẻ" dữ liệu theo công bố của chính nó; vị trí gần đúng suy ra từ IP; device
      ID dùng cho cả analytics; dữ liệu chỉ nằm trên máy thì không cần khai.
- [ ] [Console] Bộ câu hỏi content rating (IARC) đã trả lời.
- [ ] [Console] Target audience and content: chọn đúng nhóm tuổi; nếu có trẻ em thì áp dụng Families policy.
- [ ] [Console] Khai "Contains ads" đúng thực tế.
- [ ] [Console] App access: nếu cần đăng nhập, cung cấp tài khoản và hướng dẫn cho reviewer.
- [ ] `[if]` có tài khoản: xoá tài khoản ngay trong app và có link xoá trên web.
- [ ] `[if]` quyền nhạy cảm (thông báo, exact alarm, vị trí, ảnh/video, foreground service type): khai báo trong
      Console, có lý do rõ, chỉ hỏi quyền lúc cần.
- [ ] [Console] `[if]` các khai báo chính sách áp dụng: tài chính, tin tức, sức khoẻ, chính phủ, cờ bạc.
- [ ] `[if]` IP của bên thứ ba (app không chính thức / fan app): dòng miễn trừ trong listing và trong app, không
      dùng thương hiệu người khác trong tên và icon.

## 7. Kiếm tiền `[if]`

- [ ] [Code] Ads: ad unit id thật chỉ có ở bản release; bản debug dùng test id / test device.
- [ ] [Console] Consent: message UMP cho EU và các bang của Mỹ đã publish trên AdMob; trong app có mục Privacy
      options; ads (và analytics nếu cần) chờ consent.
- [ ] [Console] `app-ads.txt` đã đặt trên website developer; AdMob app được link với listing Play và với Firebase;
      đã đặt mức nội dung quảng cáo tối đa.
- [ ] [Console] Rewarded ads: frequency cap phía AdMob cao hơn giới hạn trong app, làm lưới an toàn chứ không cắt
      quảng cáo app đã mời xem.
- [ ] [Console] In-app purchase: payments profile đã thiết lập; sản phẩm (one-time / subscription) có giá và vùng
      bán; có danh sách license tester.
- [ ] [Device] Mua thử, thanh toán chờ (pending), hoàn tiền và "khôi phục giao dịch" sau khi cài lại, trên một bản
      **ký release** với application id thật: bản `.dev` không có sản phẩm nào.
- [ ] [Console] Backend billing (ví dụ RevenueCat): service account có đủ quyền trên Play Console, Real-time
      developer notifications qua Pub/Sub, và **bật Google Play Android Developer API** trong Cloud project (thiếu
      API này thì bước kiểm tra credentials thất bại dù đã cấp đủ quyền).
- [ ] [Console] Data safety có khai lịch sử mua hàng khi app bán hàng.
- [ ] [Code] Các prompt tự hiện lúc mở app (cập nhật, consent, onboarding) chạy lần lượt từng cái, không chồng nhau.

## 8. Trang store

- [ ] [Console] Tên app (tối đa 30 ký tự), mô tả ngắn (80), mô tả đầy đủ (4000), category, email liên hệ, website,
      URL privacy policy.
- [ ] [Console] Icon 512 × 512 px, feature graphic 1024 × 500 px, screenshot điện thoại; screenshot tablet nếu app
      hỗ trợ tablet.
- [ ] [Console] Listing theo ngôn ngữ cho các thị trường chính.
- [ ] [Console] Release notes cho mọi ngôn ngữ đã có listing.

## 9. Phát hành

1. [ ] Checkout tag release; build sạch; CI build AAB đã ký.
2. [ ] [Console] Upload lên **internal testing** trước: cài từ Play (không cài file tay) và chạy lại các bước kiểm
       tay ở mục 3.
3. [ ] [Console] `[if]` tài khoản cá nhân mới: closed test đủ tester và đủ số ngày (mục 1), rồi gửi yêu cầu mở
       production.
4. [ ] [Console] Trang Publishing overview không còn mục nào báo thiếu (Data safety, content rating, target
       audience, ads, app access...). Bật **Managed publishing** nếu muốn tự chọn thời điểm lên sau khi được duyệt.
5. [ ] [Console] Promote lên **production** với staged rollout (ví dụ 10% → 50% → 100%) cho các bản cập nhật. Bản
       đầu của app mới có thể bị review lâu vài ngày.

## 10. Sau khi lên production

- [ ] 72 giờ đầu: theo dõi crash, Play vitals, analytics; **dừng rollout** khi crash tăng đột biến.
- [ ] [Console] Remote Config: cập nhật version tối thiểu / mới nhất cho nhắc cập nhật.
- [ ] [Console] `[if]` có quảng cáo: AdMob đã thấy `app-ads.txt` và link với listing.
- [ ] Trả lời review; theo dõi rating.

## Những bẫy chúng tôi từng gặp

- **Key chưa đăng ký (developer verification):** một key internal app sharing sinh ra khi liên kết Firebase App
  Distribution làm Play từ chối mọi release và thay đổi listing cho đến khi được đăng ký.
- **Crash chỉ có ở bản R8:** bản debug chạy bình thường, bản release crash vì thiếu keep rule. Luôn test đúng bản
  release trước khi đẩy lên.
- **Data safety lệch với SDK:** khai "không chia sẻ dữ liệu" trong khi SDK quảng cáo công bố là có chia sẻ.
- **Billing backend báo sai credentials:** thiếu Google Play Android Developer API trong Cloud project, không phải
  thiếu quyền.
- **Test mua hàng trên bản debug:** application id `.dev` không có sản phẩm; phải test trên bản ký release.
- **Closed test 14 ngày:** tài khoản cá nhân mới không thể lên production ngay; tính thời gian này vào kế hoạch.
