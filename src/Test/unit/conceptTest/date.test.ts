const Dday = new Date()
const DdayPlus7 = new Date()
const DdayMinus7 = new Date()
DdayPlus7.setDate(Dday.getDate() + 7)
DdayMinus7.setDate(Dday.getDate() - 7)

function PlusDate(dueDate: number) {
  const Dday = new Date()
  Dday.setDate(Dday.getDate() + dueDate)
  return Dday
}

const getDday = (startDate: Date) => {
  const today = new Date()
  const difference = startDate.getTime() - today.getTime()
  let day = Math.floor(difference / (1000 * 60 * 60 * 24))
  const Remainder = difference % (1000 * 3600 * 24)
  const days = Remainder === 0 ? day : (day += 1)

  if (days > 0) {
    return `D-${days}`
  } else if (days == 0) {
    return `D-Day`
  } else {
    return `D+${-days}`
  }
}
const getDays = (startDate: Date) => {
  const today = new Date()
  const difference = startDate.getTime() - today.getTime()
  let day = Math.floor(difference / (1000 * 60 * 60 * 24))
  const Remainder = difference % (1000 * 3600 * 24)
  const days = Remainder === 0 ? day : (day += 1)

  if (days >= 7) {
    return `${Math.floor(day / 7)}주일 뒤 시작`
  } else if (days > 1) {
    return `${day}일 뒤 시작`
  } else if (days == 1) {
    return `내일부터 시작`
  } else if (days == 0) {
    return `오늘 마감`
  } else if (days > -7) {
    return `${-day}일 지남`
  } else if (days <= -7) {
    return `${Math.floor(-days / 7)}주일 지남`
  }
}

describe("Date 테스트 코드", () => {
  test("getDday 테스트 코드 작성", () => {
    //act
    const res1 = getDday(Dday)
    const res2 = getDday(DdayPlus7)
    const res3 = getDday(DdayMinus7)
    //assert
    expect(res1).toEqual("D-Day")
    expect(res2).toEqual("D-7")
    expect(res3).toEqual("D+7")
  })

  test("getDays 테스트 코드 작성", () => {
    //act
    const res1 = getDays(Dday)
    const res2 = getDays(DdayPlus7)
    const res3 = getDays(DdayMinus7)
    const res4 = getDays(PlusDate(3))
    const res5 = getDays(PlusDate(6))
    const res6 = getDays(PlusDate(11))
    const res7 = getDays(PlusDate(14))
    const res8 = getDays(PlusDate(-3))
    const res9 = getDays(PlusDate(-14))
    const res10 = getDays(PlusDate(-21))
    //assert
    expect(res1).toEqual("오늘 마감")
    expect(res2).toEqual("1주일 뒤 시작")
    expect(res3).toEqual("1주일 지남")
    expect(res4).toEqual("3일 뒤 시작")
    expect(res5).toEqual("6일 뒤 시작")
    expect(res6).toEqual("1주일 뒤 시작")
    expect(res7).toEqual("2주일 뒤 시작")
    expect(res8).toEqual("3일 지남")
    expect(res9).toEqual("2주일 지남")
    expect(res10).toEqual("3주일 지남")
  })
})
