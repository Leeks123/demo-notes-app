import * as uuid from "uuid";
import handler from "./util/handler";
import dynamoDb from "../util/dynamoDb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body); // event.body에서 request body가 넘어옴

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      // cognito identity pool에 등록된 유저 아이디
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
      noteId: uuid.v1(),
      content: data.content, // note의 내용이 들어가는 곳..
      attachment: data.attachment,
      createdAt: Date.now(),
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});
