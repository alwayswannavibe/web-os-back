const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  } else if (req.handshake?.headers?.cookie) {
    token = req.handshake.headers.cookie.split('=')[1];
  }
  return token;
};

export { cookieExtractor };
