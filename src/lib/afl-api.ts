/** @format */

import axios from 'axios';

/**
 * Dedicated axios instance for the AFL Fixture API.
 * No auth headers – this is a public endpoint.
 */
export const aflApi = axios.create({
  baseURL: 'https://0p0s8y841d.execute-api.ap-southeast-2.amazonaws.com/test/react-code-test',
  headers: { 'Content-Type': 'application/json' },
});
