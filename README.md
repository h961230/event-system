# 연동 규격서

## 공통 사항

- 인증: JWT (Bearer Token)
- 필수 헤더:
  - 'Authorization: Bearer <JWT>': 인증 토큰
  - 'x-user-email': Gateway가 JWT로부터 추출 후 각 서비스에 전달
- 응답 형식: JSON (UTF-8)
- 요청 형식: 'Content-Type: application/json'

## Test

- 프로젝트 내부 postman.script 폴더를 참조하여 api를 테스트하시기 바랍니다.

## Condition API

- http://localhost:3002/condition API의 경우 본 프로젝트의 테스트를 위한 api
- gateway로 라우팅 처리를 하지 않았습니다.
- user의 특정 보상을 얻기위한 조건의 충족 여부를 수정하기 위한 api
- postman.script 하위 event.postman_collection.json 내부 condition request를 참조하시기 바랍니다.

---

## Auth API

### 1. 회원가입

- **URL**: 'POST /auth/signup'
- **권한**:
- **Request Body**:

| 필드명   | 타입     | 필수 | 설명                         |
| -------- | -------- | ---- | ---------------------------- |
| email    | string   | Y    | 사용자 이메일                |
| password | string   | Y    | 비밀번호                     |
| roles    | string[] | N    | 부여할 역할 (기본값: 'USER') |

- **Response**:

```json
{
  "message": "success sign up",
  "email": "user@example.com",
  "roles": ["USER"]
}
```

---

### 2. 로그인

- **URL**: 'POST /auth/login'
- **권한**:
- **Request Body**:

| 필드명   | 타입   | 필수 | 설명          |
| -------- | ------ | ---- | ------------- |
| email    | string | Y    | 사용자 이메일 |
| password | string | Y    | 비밀번호      |

- **Response**:

```json
{
  "accessToken": "<JWT_TOKEN>"
}
```

---

### 3. 역할 변경

- **URL**: 'PATCH /auth/roles/:email'
- **권한**: ADMIN
- **Path Parameter**:
  - 'email': 대상 사용자 이메일
- **Request Body**:

| 필드명 | 타입     | 필수 | 설명             |
| ------ | -------- | ---- | ---------------- |
| roles  | string[] | Y    | 부여할 역할 목록 |

- **Response**:

```json
{
  "message": "Roles updated",
  "updated": {
    "_id": "6829d78b0c080384c3a4f337",
    "email": "test",
    "password": "$2b$10$OO6YuYoyW9R1NtD6GHxAuuzuP30i1S8AOdv08IBgJlxTWYYNgdy6i",
    "roles": ["USER"],
    "__v": 0
  }
}
```

---

## Event API

### 1. 이벤트 등록

- **URL**: 'POST /event'
- **권한**: OPERATOR, ADMIN
- **헤더**: 'x-user-email' 필수
- **Request Body**:

| 필드명      | 타입         | 필수 | 설명            |
| ----------- | ------------ | ---- | --------------- |
| title       | string       | Y    | 이벤트 제목     |
| description | string       | N    | 설명            |
| startAt     | string (ISO) | Y    | 시작 시각 (UTC) |
| endAt       | string (ISO) | Y    | 종료 시각 (UTC) |

- **Response**:

```json
{
  "eventId": 3,
  "title": "솔에르다 뿌리기",
  "description": "솔에르다 뿌리기",
  "startDate": "2025-06-01T00:00:00Z",
  "endDate": "2025-06-30T23:59:59Z"
}
```

---

### 2. 이벤트 목록 조회

- **URL**: 'GET /event'
- **권한**:
- **Response**: 이벤트 목록 배열

```json
[
  {
    "_id": "682ad7531df7c77203b757af",
    "eventId": 3,
    "title": "솔에르다 뿌리기",
    "description": "솔에르다 뿌리기",
    "state": "ACTIVE",
    "startDate": "2025-06-01T00:00:00.000Z",
    "endDate": "2025-06-30T23:59:59.000Z",
    "createdBy": "admin",
    "createdAt": "2025-05-19T07:01:39.983Z",
    "__v": 0
  }
]
```

---

### 3. 이벤트 상세 조회

- **URL**: 'GET /event/:eventId'
- **권한**:
- **Path Parameter**:
  - 'eventId': 조회할 이벤트 ID (number)
- **Response**: 이벤트 목록

```json
{
  "_id": "682ad7531df7c77203b757af",
  "eventId": 3,
  "title": "솔에르다 뿌리기",
  "description": "솔에르다 뿌리기",
  "state": "ACTIVE",
  "startDate": "2025-06-01T00:00:00.000Z",
  "endDate": "2025-06-30T23:59:59.000Z",
  "createdBy": "admin",
  "createdAt": "2025-05-19T07:01:39.983Z",
  "__v": 0
}
```

---

### 4. 이벤트 상태 변경

- **URL**: 'PATCH /event/state'
- **권한**: OPERATOR, ADMIN
- **Request Body**:

| 필드명  | 타입   | 필수 | 설명                  |
| ------- | ------ | ---- | --------------------- |
| eventId | number | Y    | 상태 변경할 이벤트 ID |
| state   | string | Y    | 상태 값 (예: ACTIVE)  |

- **Response**: 변경된 상태 정보 또는 처리 결과 메시지

```json
{
  "_id": "682ad7531df7c77203b757af",
  "eventId": 3,
  "title": "솔에르다 뿌리기",
  "description": "솔에르다 뿌리기",
  "state": "ACTIVE",
  "startDate": "2025-06-01T00:00:00.000Z",
  "endDate": "2025-06-30T23:59:59.000Z",
  "createdBy": "admin",
  "createdAt": "2025-05-19T07:01:39.983Z",
  "__v": 0
}
```

---

---

## Reward API

### 1. 보상 등록

- **URL**: 'POST /reward/detail'
- **권한**: OPERATOR, ADMIN
- **Request Body**:

| 필드명       | 타입     | 필수 | 설명                   |
| ------------ | -------- | ---- | ---------------------- |
| eventId      | number   | Y    | 이벤트 ID              |
| name         | string   | Y    | 보상 이름              |
| description  | string   | N    | 보상 설명              |
| conditionIds | number[] | Y    | 보상 지급 조건 ID 목록 |

- **Response**: 생성된 보상 정보

```json
{
  "rewardId": 23,
  "eventId": 3,
  "type": "ITEM",
  "conditionIds": [1],
  "name": "솔에르다",
  "quantity": 100,
  "_id": "682b08840d3006f6815ad79c",
  "__v": 0
}
```

---

### 2. 이벤트별 보상 조회

- **URL**: 'GET /reward/detail?eventId=1'
- **권한**:
- **Query Parameter**:

  - 'eventId': 조회할 이벤트 ID

- **Response**: 해당 이벤트의 보상 목록

```json
{
  "_id": "682ad7681df7c77203b757bb",
  "rewardId": 2,
  "eventId": 3,
  "type": "ITEM",
  "conditionIds": [1],
  "name": "솔에르다",
  "quantity": 100,
  "__v": 0
}
```

---

## RewardRequest API

### 1. 보상 요청

- **URL**: 'POST /rewardRequest/:rewardId'
- **권한**: USER, ADMIN
- **Path Parameter**:

  - 'rewardId': 요청할 보상 ID

- **Response**:

```json
{
  "requestStatus": "SUCCESS",
  "reason": "조건 미충족시 메시지"
}
```

---

### 2. 내 보상 요청 이력 조회

- **URL**: 'GET /rewardRequest'
- **권한**: USER, ADMIN
- **Response**: 본인 요청 이력 목록

```json
[
  {
    "_id": "682ad7701df7c77203b757c3",
    "userEmail": "admin",
    "rewardId": 2,
    "eventId": 3,
    "requestStatus": "SUCCESS",
    "reason": "",
    "requestedAt": "2025-05-19T07:02:33.648Z",
    "__v": 0
  }
]
```

---

### 3. 요청 모니터링 (관리자/감사자)

- **URL**: 'GET /rewardRequest/monitoring'
- **권한**: ADMIN, AUDITOR
- **Query Parameters**:

| 파라미터      | 타입   | 설명                        |
| ------------- | ------ | --------------------------- |
| userEmail     | string | 유저 이메일 (선택)          |
| eventId       | number | 이벤트 ID (선택)            |
| requestStatus | string | 'SUCCESS', 'FAILURE' (선택) |
| page          | number | 페이지 번호 (기본 1)        |
| limit         | number | 페이지 크기 (기본 10)       |

- **Response**: 필터링된 요청 이력 목록

```json
{
  "total": 1,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "_id": "682ad7701df7c77203b757c3",
      "userEmail": "admin",
      "rewardId": 2,
      "eventId": 3,
      "requestStatus": "SUCCESS",
      "reason": "",
      "requestedAt": "2025-05-19T07:02:33.648Z",
      "__v": 0
    }
  ]
}
```

---
