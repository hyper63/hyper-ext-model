//import { z } from 'zod'

// model configuration flags
export interface Config {
  name: string;
  schema: unknown;
  log: boolean;
  /*
  cache: boolean;
  search: string[];
  */
}
