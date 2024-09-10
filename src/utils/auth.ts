import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderServiceException,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { decomposeUnverifiedJwt } from 'aws-jwt-verify/jwt';
import type { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import { mock } from 'src/configs';
import type { Auth } from 'src/services';
import { errorWrapper } from './errorWrapper';

async function getUser(accessToken: string) {
  const command = new GetUserCommand({ AccessToken: accessToken });

  const data = await new CognitoIdentityProviderClient({}).send(command);
  const attrs = data.UserAttributes || [];
  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
  let emailVerified;
  let email = '';
  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
  let firstName;
  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
  let lastName;

  // https://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/user-pool-settings-attributes.html
  // biome-ignore lint/complexity/noForEach: <explanation>
  attrs.forEach((item) => {
    if (item.Name === 'email_verified') {
      emailVerified = item.Value;
    }
    if (item.Name === 'email') {
      email = item.Value!;
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
  try {
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
  } catch (err) {
    if (err instanceof CognitoIdentityProviderServiceException) {
      throw errorWrapper(err.$response?.statusCode || 500, err.message);
    }
    throw err;
  }
}
