import { rand } from "../../middlewares/utile"

describe("기초적인 테스트 입니다.", () => {
  test("1+1은 2입니다.", () => {
    expect(1 + 1).toEqual(2)
  })
})

describe("랜덤 미들웨어 테스트 해보기", () => {
  test("랜덤 함수는 min과 max을 잘 동작하는 가?", () => {
    const n = rand(10, 100)
    expect(n).toBeGreaterThanOrEqual(10)
    expect(n).toBeLessThanOrEqual(100)
  })
})
