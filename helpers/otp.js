

otpGenerator = () => {
    return new Promise((resolve,reject)=>{
        let otp = ~~Math.floor(1000 + Math.random() * 9000);
        if(otp) resolve(otp);
        reject(otp);
    })
}


otpExpiry = (otp_generated_at) => {
    return new Promise((resolve,reject)=>{
   
  let current_date = new Date();
  otp_generated_at = new Date(otp_generated_at);
  let diff = Math.abs(current_date - otp_generated_at);
  let min = Math.floor((diff/1000)/60);
  if(min == 0) min = 1;
  if(min) resolve(min);
  reject(min);
    });
}

module.exports = {
    otpGenerator,
    otpExpiry
}