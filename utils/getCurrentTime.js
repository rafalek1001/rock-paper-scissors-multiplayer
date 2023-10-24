export const getCurrentTime = () => {
  let date = new Date();
  let hour = (date.getHours() < 10 ? '0' : '') + date.getHours();
  let minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  return `${hour}:${minute}`;
};