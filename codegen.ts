import { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

dotenv.config({ path: '.dev.vars' });

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      'https://graphql.datocms.com': {
        headers: {
          Authorization: `Bearer ${process.env.DATOCMS_API_KEY as string}`,
          'X-Exclude-Invalid': 'true',
        },
      },
    },
  ],
  documents: ['./src/graphql/**/*.graphql'],
  generates: {
    './src/graphql/types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node',
        {
          add: {
            content:
              "import { type Record as StructuredTextGraphQlResponseRecord, type StructuredText as StructuredTextGraphQlResponse } from 'datocms-structured-text-utils';",
          },
        },
      ],
      config: {
        strictScalars: true,
        scalars: {
          BooleanType: 'boolean',
          CustomData: 'Record<string, string>',
          Date: 'string',
          DateTime: 'string',
          FloatType: 'number',
          IntType: 'number',
          ItemId: 'string',
          JsonField:
            'StructuredTextGraphQlResponse<StructuredTextGraphQlResponseRecord,StructuredTextGraphQlResponseRecord>',
          MetaTagAttributes: 'Record<string, string>',
          UploadId: 'string',
        },
      },
    },
  },
};

export default config;
