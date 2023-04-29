import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { decomposeUnverifiedJwt } from 'aws-jwt-verify/jwt';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { mock } from 'src/configs';
import { Auth } from 'src/services';

async function getUser(accessToken: string) {
  const command = new GetUserCommand({ AccessToken: accessToken });

  const data = await new CognitoIdentityProviderClient({}).send(command);
  const attrs = data.UserAttributes || [];
  let emailVerified;
  let email = '';
  let firstName;
  let lastName;

  // https://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/user-pool-settings-attributes.html
  attrs.forEach((item) => {
    if (item.Name === 'email_verified') {
      emailVerified = item.Value;
    }
    if (item.Name === 'email') {
      email = item.Value as string;
    }
    if (item.Name === 'custom:FirstName') {
      firstName = item.Value;
    }
    if (item.Name === 'custom:LastName') {
      lastName = item.Value;
    }
  });

  if (emailVerified !== 'true') {
    throw new Error('email not verified');
  }
  return {
    email,
    name: `${firstName} ${lastName}`,
  };
}

export async function verify(jwt: string): Promise<Auth> {
  if (mock.enable) {
    return mock.auth;
  }
  const attr = await getUser(jwt);

  // decode jwt and get tenantId from it
  const decode = decomposeUnverifiedJwt(jwt).payload as CognitoAccessTokenPayload;

  const auth = {
    token: jwt,
    tenantId: decode.iss.split('com/')[1],
    clientId: decode.client_id,
    userId: decode.sub,
    email: attr.email,
    name: attr.name,
    groups: decode['cognito:groups'] || [],
  };
  return auth;
}
