/// <reference lib="webworker" />

import { computeWork } from 'nanocurrency';
import { log } from 'simply-logs';

addEventListener('message', async ({ data }) => {
  log.debug('computing work');
  const hash = data;
  const work = await computeWork(hash);
  postMessage(work, undefined);
  log.debug('compute work ends');
});

