const args = process.argv.slice(2);
const data = {};

args.forEach((item, idx) => {
  const argArray = item.split("=");
  data[argArray[0].slice(1)] = argArray[1];
});

const config = {
  APP_PORT: process.env.APP_PORT,
  ENV: data.env,
};

module.exports.config = config;
