import * as iam from "@aws-cdk/aws-iam";
import * as sst from "@serverless-stack/resources";

export default class AuthStack extends sst.Stack {
  auth;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { api, bucket } = props;

    // Cognito User pool 생성
    this.auth = new sst.Auth(this, "Auth", {
      cognito: {
        userPool: {
          signInAliases: { email: true }, // 이메일로 로그인 하도록 설정
        },
      },
    });

    this.auth.attachPermissionsForAuthUsers([
      api, // api 접근 허용..props에서 넘어옴
      new iam.PolicyStatement({
        // s3 접근 허용
        actions: ["s3:*"],
        effect: iam.Effect.ALLOW,
        resources: [
          bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*", // 인증된 유저의 아이디를 기반으로 버킷의 특정 부분에 접근..이걸로 버킷의 접근을 분리한다.
        ],
      }),
    ]);

    this.addOutputs({
      Region: scope.region,
      UserPoolId: this.auth.cognitoUserPool.userPoolId,
      IdentityPoolId: this.auth.cognitoCfnIdentityPool.ref,
      UserPoolClientId: this.auth.cognitoUserPoolClient.userPoolClientId,
    });
  }
}
