export const differenceBetweenDates = (date1: Date, date2: Date) => {
  const diff = date1.getTime() - date2.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}

export const diffToNextMonth = (utcDate: Date) => {
  const currentMonth = utcDate.getUTCMonth()
  const nextMonth = (currentMonth + 1) % 12
  const nextMonthYear =
    currentMonth === 11
      ? utcDate.getUTCFullYear() + 1
      : utcDate.getUTCFullYear()
  const firstDayOfNextMonth = new Date(Date.UTC(nextMonthYear, nextMonth, 1))

  const diffTime = Math.ceil(
    (firstDayOfNextMonth.getTime() - utcDate.getTime()) / 1000
  )

  return {
    seconds: String(diffTime % 60).padStart(2, "0"),
    minutes: String(Math.floor(diffTime / 60) % 60).padStart(2, "0"),
    hours: String(Math.floor(diffTime / 3600) % 24).padStart(2, "0"),
    days: String(Math.floor(diffTime / 86400)).padStart(2, "0"),
  }
}
