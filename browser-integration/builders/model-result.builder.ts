import type { ModelResult } from '../../src/api';
import { MEDIA_ORIGIN } from '../mocks/media.mock';

let lastId = 0;

/** A model result, with its own id. Its image is the test cat (mocks/media.mock.ts). */
export const aModelResult = ({ id = `result-${++lastId}`, ...overrides }: Partial<ModelResult> = {}): ModelResult => ({
  id,
  prompt: 'a cat in a tiny hat',
  imageUrl: `${MEDIA_ORIGIN}/${id}.svg`,
  ...overrides,
});
