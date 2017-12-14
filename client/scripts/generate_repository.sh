#!/usr/bin/env bash

dir=`pwd`/src/$1/repositories
name=$2Repository

mkdir -p $dir
mkdir -p $dir/doubles
mkdir -p $dir/web

echo -e "interface ${name} {}

export default ${name};" > $dir/${name}.ts

echo -e "import ${name} from './${name}';

export default function ${name}Contract(subject: ${name}) {}" > $dir/${name}Contract.ts

echo -e "import ${name} from '../${name}';

export default class ${name}Stub implements ${name} {}" > $dir/doubles/${name}Stub.ts

echo -e "import ${name} from '../${name}';

export default class Web${name} implements ${name} {
    constructor(private baseUrl: string = ''){}
}" > $dir/web/Web${name}.ts

echo -e "import ${name}Contract from '../${name}Contract';
import ${name}Stub from './${name}Stub';

describe('${name}Stub', () => {
${name}Contract(new ${name}Stub());
});" > $dir/doubles/${name}Stub.contract.ts

echo -e "import ${name}Contract from '../${name}Contract';
import Web${name} from './Web${name}';

describe('Web${name}', () => {
const HOST = process.env.REACT_APP_HOST || 'http://localhost:8080';
${name}Contract(new Web${name}(HOST));
});" > $dir/web/Web${name}.contract.ts