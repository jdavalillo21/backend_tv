const GoogleAuth  = require('google-auth-library');

var client = new GoogleAuth.OAuth2Client(
    process.env.GOOGLE_ID,
    process.env.GOOGLE_SECRET,
    ""
);


const googleVerify = async( token ) => {
    
    
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    console.log(payload);
    const { sub, name, family_name, email, picture } = payload;

  return { sub, name, family_name, email, picture };

  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}

module.exports = {
    googleVerify
}