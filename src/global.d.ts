import type { MockedFunction } from 'jest-mock';

declare global {
  var fetch: MockedFunction<typeof window.fetch>;
}

export {}; 