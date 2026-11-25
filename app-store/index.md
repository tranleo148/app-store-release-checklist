# Checklist release App Store (iOS)

Checklist cho lần đầu đưa một app mobile lên App Store (app iOS native, hoặc app đa nền tảng như KMP,
Flutter, React Native). Checklist được rút ra từ một bản release đã qua App Review.

Nhãn: **[Mac]** cần Xcode / simulator / iPhone · **[Console]** làm tay trên App Store Connect, Apple Developer
hoặc console của SDK · **[Code]** sửa trong repo · `[if]` chỉ áp dụng khi app có tính năng đó.

Tên vendor bên dưới (Firebase, AdMob/UMP, RevenueCat) chỉ là ví dụ của stack hay dùng; thay bằng stack của bạn.

---

## 1. Tài khoản và định danh

- [ ] [Console] Tài khoản Apple Developer Program còn hiệu lực; ghi lại Team ID để điền vào config Xcode.
- [ ] [Console] Đăng ký App ID cho bundle id production. Bundle id bản dev (`<id>.dev`) có thể để Xcode
      automatic signing tự tạo khi chạy lần đầu trên máy thật.
- [ ] [Code] Hai target: production (`<id>`, "App") và dev (`<id>.dev`, "App Dev"), để bản dev cài song song
      với bản store trên cùng một máy. Test target đi theo id dev (`<id>.dev.tests`, ...).
- [ ] [Console] Tạo app record trên App Store Connect (tên, ngôn ngữ chính, bundle id, SKU).
- [ ] [Code] Đưa Apple ID dạng số của app record vào config, để các link "Đánh giá" / "Chia sẻ" / "Cập nhật"
      trong app trỏ đúng trang store (khi còn trống thì link không làm gì, không được crash).
- [ ] [Console] Firebase (hoặc SDK analytics/crash của bạn): mỗi bundle id một app iOS, mỗi target một file
      `GoogleService-Info.plist`.
- [ ] [Console] `[if]` có quảng cáo: tạo app iOS trên AdMob và mỗi placement mà bản Android dùng một ad unit;
      app id để trong Info.plist, unit id để trong file config bị git-ignore, kèm một file `.template` được commit.
- [ ] [Console] `[if]` có quảng cáo: các message consent của UMP bao gồm cả app iOS (quy định EU, các bang
      của Mỹ, IDFA explainer).
- [ ] URL privacy policy và URL support có ghi tên app (và tên trên store, nếu tên trên iOS khác).

## 2. Project Xcode và build

- [ ] [Mac] Chốt deployment target (ví dụ bằng mức tối thiểu của các app iOS khác của bạn).
- [ ] [Mac] Info.plist / build settings:
  - `ITSAppUsesNonExemptEncryption` = `false` khi app chỉ dùng mã hoá do hệ điều hành cung cấp (HTTPS,
    CryptoKit). Khi đó App Store Connect không hỏi export compliance ở mỗi build.
  - `[if]` có quảng cáo: `GADApplicationIdentifier`, `SKAdNetworkItems`, `NSUserTrackingUsageDescription`.
  - Launch screen, app category, `CADisableMinimumFrameDurationOnPhone` (ProMotion), các flag analytics.
- [ ] [Mac] Thêm `PrivacyInfo.xcprivacy` (các loại dữ liệu thu thập, required-reason API). Để
      `NSPrivacyTracking` = false, trừ khi bạn khai báo luôn tracking domains: khi người dùng từ chối ATT, iOS
      chặn các domain đó, có thể làm hỏng cả quảng cáo non-personalized. Các SDK đã có manifest riêng của chúng.
- [ ] [Mac] Icon 1024 px (file `.icon` của Icon Composer cho Liquid Glass, hoặc PNG 1024 px); không giữ phần
      padding adaptive icon của Android.
- [ ] [Mac] Crash reporting: run script upload dSYM cho các build không phải Debug. Nếu SDK SPM dạng static để
      lại các framework dylib "stub" không có dSYM, tạo dSYM cho chúng bằng một run script, nếu không lúc
      upload sẽ báo "Upload Symbols Failed".
- [ ] [Code] Version: `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` khớp với version và versionCode của
      Android (tốt nhất lấy từ cùng một git tag). App Store Connect không nhận hai build trùng build number,
      nên sửa lỗi sau khi bị từ chối phải lên một bản patch mới, không upload lại được.
- [ ] [Code] CI build app cho simulator (không ký) để phát hiện sớm lỗi iOS.
- [ ] [Code] Với app đa nền tảng: mỗi `expect` / interface theo nền tảng đều có implementation thật cho iOS;
      compile target iOS sau mỗi lần sửa code chung (KMP compile được Kotlin iOS trên cả Windows/Linux).

## 3. Nội dung nhạy cảm với store (nếu có, làm việc này trước tiên)

- [ ] `[if]` app hiển thị IP của bên thứ ba (hình ảnh game, phim, thương hiệu): chốt những gì không được có
      trên iOS. Để các asset đó nằm ngoài bundle iOS và ngoài mọi thứ app iOS tải về, không chỉ ẩn đi.
- [ ] Không có feature flag hay giá trị remote config nào thay đổi được nội dung đã được duyệt (ví dụ bật lại
      hình ảnh có bản quyền). App Review coi nội dung bật/tắt từ xa là tính năng ẩn.
- [ ] Remote Config / banner từ xa: cho iOS giá trị riêng qua một condition theo nền tảng, để banner dành cho
      Android không bao giờ hiện trên iOS.
- [ ] Trước mỗi lần upload, kiểm tra file archive không chứa file nào bị loại, ví dụ
      `find build/App.xcarchive/Products/Applications/*.app -path '*<thu-muc-bi-loai>/*' | wc -l` in ra `0`.

## 4. Test

- [ ] [Mac] Chạy test chung/unit test trên simulator iOS (không chỉ trên JVM/Android): code theo nền tảng như
      mã hoá, đọc file, tên exception có thể khác nhau.
- [ ] [Mac] Smoke UI test (XCUITest): mở app, các danh sách chính, một màn chi tiết, các màn đặc biệt, đổi
      ngôn ngữ. Chạy từ bản cài mới.
- [ ] [Mac] Kiểm tay trên iPhone thật (bản TestFlight):
  - dữ liệu từ bundle và từ mạng/CDN;
  - `[if]` có quảng cáo: mọi placement với **test** unit (không bao giờ bấm vào quảng cáo thật);
  - `[if]` có quảng cáo: form consent với debug geography EEA, **sau đó** mới đến hộp thoại ATT;
  - `[if]` có rewarded ad: phần thưởng được trao;
  - event analytics hiện trong DebugView;
  - một crash cố ý hiện trên console crash với stack trace đã symbolicate.
- [ ] App Android vẫn pass hết (host test, build, device test) sau khi sửa code chung.

## 5. In-app purchase `[if]`

- [ ] [Console] Paid Applications agreement, thông tin ngân hàng và thuế ở trạng thái Active trên App Store
      Connect (thiếu là không bán được gì).
- [ ] [Console] Tạo sản phẩm (loại, product id giống Android nếu dùng chung code), tên hiển thị, mô tả, giá,
      **vùng bán (availability)** (sản phẩm chưa có vùng bán sẽ chặn việc nộp).
- [ ] [Console] Mỗi sản phẩm có **review screenshot** (màn hình mua) và **review notes**. Phải có một build
      hiện được màn hình mua mới chụp được, nên bật flag bán hàng cho một build test.
- [ ] [Console] Backend billing (ví dụ RevenueCat): thêm app App Store với In-App Purchase key, gắn sản phẩm
      vào entitlement và offering; public key `appl_` trong config release, key test store trong config dev.
- [ ] [Console] Các remote flag điều khiển việc bán: giá trị iOS là `true` khi nộp (reviewer phải mua được).
- [ ] [Mac] TestFlight + sandbox tester: mua, thanh toán chờ duyệt (Ask to Buy), Restore Purchase sau khi cài
      lại, và tác dụng của gói mua (ví dụ hết quảng cáo).
- [ ] Phần mô tả nói rõ tính năng nào cần trả tiền hoặc xem quảng cáo (guideline 2.3.2).
- [ ] Nếu hai sản phẩm bán cùng một thứ (ví dụ giá ra mắt và giá thường) nhưng mỗi lúc chỉ hiện một, ghi rõ
      trong review notes: reviewer có thể đi tìm cả hai.
- [ ] Lần release đầu: sản phẩm phải nằm **cùng submission** với version app. Ở giao diện App Store Connect
      hiện tại, bấm "Add for Review" trên từng sản phẩm sẽ đưa nó vào một Draft Submission, rồi version vào
      chung draft đó. Sửa review notes của sản phẩm trước bước này: vào draft rồi là bị khoá.
- [ ] Privacy policy có nhắc đến App Store và nhà cung cấp billing.

## 6. Quyền riêng tư và pháp lý

- [ ] [Console] Nhập **và publish** App Privacy label ("nhãn dinh dưỡng"); khớp với `PrivacyInfo.xcprivacy`
      và privacy policy. Có quảng cáo thì Device ID và Advertising Data được dùng để tracking. Cập nhật mỗi khi
      cách xử lý dữ liệu thay đổi.
- [ ] [Console] Trả lời bộ câu hỏi age rating (quảng cáo cũng tính; không có UGC/web/chat thì chọn không) và
      đối chiếu kết quả với rating trên Play.
- [ ] [Console] Export compliance: không cần upload gì khi `ITSAppUsesNonExemptEncryption` là `false` và mọi
      mã hoá đều đến từ hệ điều hành.
- [ ] [Console] **Content Rights** (App Information): trả lời trung thực app có chứa nội dung của bên thứ ba
      hay không. Đây là cam kết pháp lý đứng tên chủ tài khoản, nên để chủ tài khoản tự trả lời.
- [ ] [Console] Trang **App Compliance**: nếu app bán ở Trung Quốc đại lục, các mục như "Security Assessment"
      và "AI Generated or Synthetic Content" sẽ báo "Missing Info". Khai báo chúng, hoặc bỏ Trung Quốc đại lục
      khỏi vùng bán.
- [ ] `[if]` có tài khoản: cho xoá tài khoản ngay trong app; có Sign in with Apple nếu có đăng nhập bằng bên
      thứ ba khác.
- [ ] Dòng miễn trừ trách nhiệm về IP của bên thứ ba trong app (màn About) và ở cuối mô tả trên store.

## 7. Trang store

- [ ] [Console] Tên, subtitle, keyword và category. Không dùng thương hiệu của bên thứ ba trong tên, subtitle
      hay keyword.
- [ ] [Console] Mô tả và promotional text; thêm dòng "không chính thức / không liên kết với..." khi app nói
      về IP của người khác.
- [ ] [Console] Screenshot của **giao diện thật đúng như bản iOS** cho mọi size App Store Connect yêu cầu
      (xem "View All Sizes in Media Manager": nhiều size iPhone và slot iPad nếu app chạy trên iPad). Bỏ các
      ảnh mà phần lớn là hình ảnh của bên thứ ba.
- [ ] [Console] Support URL, marketing URL (website của bạn: sau này cần cho `app-ads.txt`), privacy policy URL.
- [ ] [Console] **Pricing and Availability** cho chính app (giá, kể cả Free, và vùng bán). Đây là một trang
      riêng trong mục Distribution, không nằm trong trang version, rất dễ quên.
- [ ] [Console] Review Notes: app làm gì, không cần đăng nhập (hoặc cho tài khoản demo), những gì reviewer có
      thể thắc mắc; thông tin liên hệ cho App Review. Chuẩn bị sẵn câu trả lời cho lý do từ chối dễ gặp nhất.

## 8. Build, upload và nộp

1. [ ] Checkout tag/commit release; build sạch (`./gradlew clean` hoặc tương đương).
2. [ ] Dữ liệu từ xa mà app cần đã được publish (CDN/backend khớp với bundle).
3. [ ] Có đủ config release: ad unit thật, key billing release (thiếu thì bản store hiện quảng cáo demo hoặc
       không bán được).
4. [ ] Test pass trên Mac (test chung trên simulator, smoke UI test).
5. [ ] [Mac] Archive: scheme production, destination *Any iOS Device (arm64)*, configuration Release
       (Xcode Product → Archive, hoặc `xcodebuild archive`).
6. [ ] [Mac] Kiểm tra archive không chứa nội dung bị loại (mục 3).
7. [ ] [Mac] Upload: Organizer → Distribute App → App Store Connect.
8. [ ] [Mac] TestFlight: cài lên iPhone và chạy các bước kiểm tay (mục 4).
9. [ ] [Console] Trước khi bấm "Add for Review" (nó sẽ từ chối và nêu từng mục còn thiếu): Pricing and
       Availability của app, Content Rights, screenshot, in-app purchase đã sẵn sàng (vùng bán, review
       screenshot, notes).
10. [ ] [Console] Chọn build, Add for Review, Submit. Chọn **phát hành thủ công (manual release)** để tự quyết
        thời điểm lên store.

## 9. Sau khi được duyệt / lên store

- [ ] [Console] Phát hành version bằng tay.
- [ ] [Console] Remote Config: đặt giá trị nhắc cập nhật cho iOS (version tối thiểu / mới nhất) theo version
      trên App Store, để các bản cũ được nhắc cập nhật.
- [ ] [Console] `[if]` có quảng cáo: link app iOS trên AdMob với trang App Store đang chạy.
- [ ] [Console] `[if]` có quảng cáo: AdMob tìm thấy `app-ads.txt` trên website developer ghi trong trang App Store.
- [ ] Theo dõi crash, analytics và review trong những ngày đầu.

## Những bẫy bị từ chối mà chúng tôi đã chuẩn bị trước

- **IP của bên thứ ba (guideline 5.2.1):** asset có bản quyền không có trong app iOS, dòng miễn trừ trong mô
  tả và trong app, không dùng thương hiệu trong tên/keyword, screenshot không có hình ảnh có bản quyền, câu trả
  lời soạn sẵn cho reviewer.
- **Tính năng ẩn:** không có công tắc từ xa nào thay đổi nội dung đã được duyệt.
- **Công khai việc trả phí (2.3.2):** mô tả nói rõ phần nào phải trả tiền hoặc xem quảng cáo.
- **Những thứ chỉ chặn ở bước "Add for Review":** Pricing and Availability, Content Rights, vùng bán của IAP,
  review screenshot của IAP, các mục compliance cho Trung Quốc đại lục.
- **Thông tin privacy không khớp:** App Privacy label, `PrivacyInfo.xcprivacy` và privacy policy phải nói cùng
  một điều.
