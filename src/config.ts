const args = process.argv.slice(2);
const data: any = {};

args.forEach((item, idx) => {
  const argArray = item.split("=");
  data[argArray[0].slice(1)] = argArray[1];
});

export const config = {
  APP_PORT: process.env.APP_PORT,
  ENV: data.env,
};
