import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { decomposeUnverifiedJwt } from 'aws-jwt-verify/jwt';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { mock } from 'src/configs';
import { Auth } from 'src/services';

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

async function getUser(accessToken: string) {
  const command = new GetUserCommand({ AccessToken: accessToken });

  const data = await new CognitoIdentityProviderClient({}).send(command);
  const attrs = data.UserAttributes || [];
  let email_verified;
  let email = '';
  let firstName;
  let lastName;
  for (const item of attrs) {
    if (item.Name === 'email_verified') {
      email_verified = item.Value;
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
  }
  if (email_verified === 'false') {
    throw new Error('email not verified');
  }
  return {
    email,
    name: `${firstName} ${lastName}`,
  };
}
