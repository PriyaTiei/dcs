import apiClient, { BACKEND_URL } from './apiClient';
import oracleApi from './oracleApi';
import postgresApi from './postgresApi';
import dcsApi from './dcsApi';
import crankApi from './crankApi';
import changePointApi from './changePointApi';

export {
  apiClient,
  BACKEND_URL,
  oracleApi,
  postgresApi,
  dcsApi,
  crankApi,
  changePointApi,
};

export default {
  client: apiClient,
  baseUrl: BACKEND_URL,
  oracle: oracleApi,
  postgres: postgresApi,
  dcs: dcsApi,
  crank: crankApi,
  changePoint: changePointApi,
};
