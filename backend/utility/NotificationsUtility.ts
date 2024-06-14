export const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
  return { otp, expiry };
};

//send otp to verified number
export const requestOtp = async (otp: number, phone: String) => {
  const accountSid = "";
  const authToken = "";
  const client = require("twilio")(accountSid, authToken);
  const res = await client.messages.create({
    body: `your otp is ${otp}`,
    from: "",
    to: `+91${phone}`,
  });
  return res;
};
