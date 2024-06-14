const addTime = (time: String) => {
  let hour = parseInt(time.split(':')[0]),
    minute = parseInt(time.split(':')[1]);
  const newMinute = minute === 0 ? '30' : '00';
  const hourNext = hour + 1;
  const newHour =
    newMinute === '00'
      ? hourNext < 10
        ? `0${hourNext}`
        : hourNext
      : time.split(':')[0];
  return `${newHour}:${newMinute}`;
};

const buildWorkingDay = (next: String, endTime: String, hours: String[]) => {
  next = addTime(next);
  if (`${next}:00` <= `${endTime}:00`) {
    hours.push(next);
    return buildWorkingDay(next, endTime, hours);
  } else {
    return hours;
  }
};

export { buildWorkingDay };
