import moment from 'moment';

export function activationCheck() {
  const value: any = localStorage?.getItem('activation');
  if (value === 'null' || !value) {
    return undefined;
  }
  const year = value.slice(-5).slice(0, -1);

  const activatCode = value.slice(0, -5);
  let duration = '';
  let dateDuration = '';

  for (let i = 1; i < activatCode.length; i += 2) {
    duration += activatCode[i];
  }

  for (let i = 0; i < activatCode.length; i += 2) {
    if (/[a-zA-Z]/.test(activatCode[i])) {
      dateDuration += activatCode[i];
    }
  }
  const datepurschase = duration + year;
  // console.log('datepurschase', datepurschase);

  let dateExpired;
  if (dateDuration === 'onemo') {
    const targetDate = moment(datepurschase, 'MMMDDYYYY');
    dateExpired = moment(targetDate).add(1, 'months').add(1, 'day');
    // console.log('Original Date:', targetDate.format('YYYY-MM-DD'));
    // console.log('New Date (after adding 6 months):', dateExpired.format('YYYY-MM-DD'));
  }
  if (dateDuration === 'sixmo') {
    const targetDate = moment(datepurschase, 'MMMDDYYYY');
    dateExpired = moment(targetDate).add(6, 'months').add(1, 'day');
    // console.log('Original Date:', targetDate.format('YYYY-MM-DD'));
    // console.log('New Date (after adding 6 months):', dateExpired.format('YYYY-MM-DD'));
  }
  if (dateDuration === 'oneyr') {
    const targetDate = moment(datepurschase, 'MMMDDYYYY');
    dateExpired = moment(targetDate).add(12, 'months').add(1, 'day');
    // console.log('Original Date:', targetDate.format('YYYY-MM-DD'));
    // console.log('New Date (after adding 6 months):', dateExpired.format('YYYY-MM-DD'));
  }

  // Get the current date as a Moment.js object
  const currentDate = moment();

  // Calculate the difference in days
  const differenceInDays = dateExpired?.diff(currentDate, 'days');

  return differenceInDays;
}

export default {
  activationCheck,
};
