# 무신사 장바구니 E2E 테스트 자동화

Playwright와 TypeScript를 활용하여 무신사 장바구니 핵심 사용자 시나리오를 자동화한 E2E 테스트 프로젝트입니다.

실제 사용자 관점에서 장바구니 진입, 상품 선택, 옵션 변경, 쿠폰 적용, 구매 금액 계산 등 핵심 사용자 플로우를 기반으로 테스트를 구성하였으며,
반복적으로 수행되는 회귀 테스트를 자동화하여 테스트 효율성과 유지보수성을 높였습니다.

또한 단순 UI 동작 확인이 아닌, 상품 옵션·수량 변경, 쿠폰 할인 적용, 구매 금액 계산 등 데이터 정합성까지 검증하도록 구현했습니다.

> ⚠️ 본 프로젝트는 개인 학습 및 포트폴리오 목적으로 작성되었습니다.
> 실제 서비스 환경을 대상으로 테스트를 수행하므로 테스트 계정과 테스트 데이터가 필요하며,
> 저장소에는 개인 계정 정보 및 민감한 데이터가 포함되어 있지 않습니다.

---

## 주요 구현 내용

- Playwright 기반 E2E 테스트 자동화
- Page Object Model(POM) 기반 테스트 구조 설계
- Locator와 Action 분리를 통한 유지보수성 향상
- 상품 옵션·수량 변경 및 금액 계산 검증
- 쿠폰 적용 및 할인 금액 검증
- 구매 금액 데이터 정합성 검증
- Playwright HTML Report 지원

---

## 기술 스택

- Playwright
- TypeScript
- Node.js
- Git
- GitHub

---

## 테스트 시나리오

```text
장바구니 진입
      ↓
로그인
      ↓
카테고리 검증
      ↓
상품 선택
      ↓
좋아요
      ↓
상품 삭제
      ↓
옵션 변경
      ↓
쿠폰 적용
      ↓
구매 금액 검증
      ↓
주문서 이동
```

---

현재 장바구니 핵심 기능을 대상으로 총 **180여 개 테스트 케이스 중 회귀 테스트 가치가 높은 핵심 시나리오를 자동화**하였습니다.

- 장바구니 진입
- 로그인 리다이렉트
- 카테고리 탭
- 상품 선택
- 좋아요
- 상품 삭제
- 옵션 변경
- 쿠폰 적용
- 구매 금액 검증
- 주문서 이동

---

## 프로젝트 특징

- Page Object Model(POM)을 적용하여 페이지별 Locator와 Action을 분리
- 테스트 단계(`test.step`)를 활용하여 시나리오 단위로 구성
- 상품 옵션·수량 변경에 따른 금액 계산 검증
- 쿠폰 할인 금액 및 구매 금액 데이터 정합성 검증
- Playwright HTML Report 지원
- 실행 로그를 통해 각 테스트 단계의 수행 결과 확인

---

## 프로젝트 구조

```text
.
├── tests
│   ├── cart-e2e.spec.ts
│   └── pages
│       ├── HomePage.ts
│       ├── CartPage.ts
│       ├── OptionPopup.ts
│       ├── CouponPopup.ts
│       └── OrderPage.ts
│
├── playwright.config.ts
├── package.json
└── README.md
```

---

## 실행 전 준비사항

### 계정 및 로그인

- 테스트 시작 시 로그아웃 상태여야 합니다.
- 로그인 페이지에서 Playwright가 `page.pause()` 상태로 대기합니다.
- 원하는 방법으로 로그인 후 장바구니 페이지로 정상 리다이렉트되면 Playwright Inspector의 **Resume(▶)** 버튼을 눌러 테스트를 이어서 진행합니다.

### 테스트 데이터

- 장바구니에 상품을 **2개 이상** 담아둡니다.
- 전체 선택 체크박스는 **비활성화 상태**여야 합니다.
- 옵션 변경이 가능한 상품을 포함합니다.
- 최저가 도전 상품이 아닌 상품을 포함합니다.
- 사용 가능한 상품 쿠폰이 존재하는 상품을 포함합니다.

---

## 실행 방법

```bash
npm install
```

```bash
npx playwright install
```

```bash
npx playwright test
```

Headed 실행

```bash
npx playwright test --headed
```

HTML Report

```bash
npx playwright show-report
```

---

## 실행 결과 예시

### Playwright CLI

<img width="800" src="https://github.com/user-attachments/assets/afd81553-7b2c-41b5-9dc6-0ad23ac341f9" />

### Playwright HTML Report

<img width="800" src="https://github.com/user-attachments/assets/00ecd465-fe1f-4fa5-b00c-c7de166a90d8" />
