import { UnauthorizedException } from '@nestjs/common';
import { Http2ServerRequest } from 'http2';

const authContext = ({ req }: { req: Http2ServerRequest }) => {
  console.log('auth header', req.headers?.authorization);
  if (req.headers) {
    return {};
  }
  throw new UnauthorizedException();
};
export default authContext;
