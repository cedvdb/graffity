/// <reference lib="webworker" />

import { computeWork } from 'nanocurrency';

addEventListener('message', async ({ data }) => {
  const hash = data;
  const work = await computeWork(hash);
  postMessage(work, undefined);
});

