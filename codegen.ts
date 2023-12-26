import { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

dotenv.config({ path: '.dev.vars' });

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [process.env.DATOCMS_API_URL as string]: {
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
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
        strictScalars: true,
        scalars: {
          BooleanType: 'boolean',
          CustomData: 'Record<string, unknown>',
          Date: 'string',
          DateTime: 'string',
          FloatType: 'number',
          IntType: 'number',
          ItemId: 'string',
          JsonField: 'unknown',
          MetaTagAttributes: 'Record<string, string>',
          UploadId: 'string',
        },
      },
    },
  },
};

export default config;
