export class Constants {
    static readonly ENV_FILE_PATH = `env\\${process.env.NODE_ENV || 'dev'}.env`;
    static readonly CONFIG_SCHEMA_NAME = 'configValidationSchema';
}
