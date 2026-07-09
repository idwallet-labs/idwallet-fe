# idwallet-fe

IDWallet의 모바일 증명 제출 UX입니다. 실제 DID 지갑 엔진이 아니라, 제출 요청 수신부터 선택 제출까지의 앱 화면 흐름을 검증합니다.

## 기술 스택

- Expo
- React 최신 버전 + React Compiler
- TypeScript
- ky API client
- react-native-unistyles
- GitHub Actions CI

## 주요 기능

- 빈 지갑 상태와 증명 추가 흐름
- QR/deep link mock 제출 요청 수신
- 요청 조건에 맞는 증명 선택 제출
- 제출 완료, 만료, 폐기, 검증 실패 상태 UI
- 모바일 접근성 label과 44px 이상 터치 영역
