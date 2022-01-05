import * as sst from "@serverless-stack/resources";

export default class ApiStack extends sst.Stack {
  api;

  constructor(scope, id, props) {
    super(scope, id, props);

    const { table } = props; // props에서 기존에 생성했던 StorageStack의 table 사용가능

    this.api = new sst.Api(this, "Api", {
      // Api 생성
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
      routes: {
        "POST /notes": "src/create.main", // api 콜과 람다의 연결
        "GET /notes/{id}": "src/get.main",
        "GET /notes": "src/list.main",
        "PUT /notes/{id}": "src/update.main",
        "DELETE /notes/{id}": "src/delete.main",
      },
    });

    this.api.attachPermissions([table]); // 실제로 디비에 접근 가능하도록 허용
    this.addOutputs({
      // api 결과 출력
      ApiEndpoint: this.api.url,
    });
  }
}
