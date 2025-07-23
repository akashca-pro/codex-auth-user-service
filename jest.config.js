import { createDefaultPreset } from 'ts-jest/presets';

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // support for "@/..." alias
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
};
