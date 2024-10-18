import { parseOptions } from './parseOptions'
import { Config } from './types'

const npmScripts = { first: 'test', second: 'test' }

describe('parseOptions', () => {
  describe('options', () => {
    it('should return all npm scripts if no options override', () => {
      const config: Config = { options: {} }

      const result = parseOptions(config, npmScripts)

      expect(result).toStrictEqual({ first: {}, second: {} })
    })

    it('should allow config to be undefined', () => {
      const result = parseOptions(undefined, npmScripts)

      expect(result).toStrictEqual({ first: {}, second: {} })
    })

    it('should combine config and npm scripts', () => {
      const config: Config = { options: { third: { exec: 'testing' } } }

      const result = parseOptions(config, npmScripts)

      expect(result).toStrictEqual({
        first: {},
        second: {},
        third: { exec: 'testing' },
      })
    })

    it('should use config to override npm scripts', () => {
      const config: Config = { options: { second: { exec: 'testing' } } }

      const result = parseOptions(config, npmScripts)

      expect(result).toStrictEqual({
        first: {},
        second: { exec: 'testing' },
      })
    })
  })
  describe('exclude', () => {
    it('should not exclude any when exclude is omitted', () => {
      const config: Config = {}

      const result = parseOptions(config, npmScripts)

      expect(result).toStrictEqual({
        first: {},
        second: {},
      })
    })

    it('should exclude full name matches', () => {
      const config: Config = { exclude: ['first'] }

      const result = parseOptions(config, npmScripts)

      expect(result).toStrictEqual({
        second: {},
      })
    })

    it('should exclude glob matches', () => {
      const config: Config = { exclude: ['fi*'] }

      const result = parseOptions(config, npmScripts)

      expect(result).toStrictEqual({
        second: {},
      })
    })

    it('should not filter out config options', () => {
      const config: Config = {
        exclude: ['fi*'],
        options: { final: { exec: 'testing' } },
      }

      const result = parseOptions(config, npmScripts)

      expect(result).toStrictEqual({
        second: {},
        final: { exec: 'testing' },
      })
    })
  })
})
