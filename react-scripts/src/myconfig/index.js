import Config from './config.json';

const environment = process.env.REACT_APP_ENV || 'development';
const environmentConfig = Config[environment];
const productionConfig = Config["production"];
const isDebugMode = (environment === 'development') || (environment === 'local');

export {environmentConfig, productionConfig, isDebugMode};
export default Config;
