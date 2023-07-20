export function convertError<E = unknown, R = void>(
  errOrFunc: E | (() => R),
  unknownErrorMessage = 'Unknown error',
) {
  let isError: boolean
  let error: E
  let result: R
  if (errOrFunc instanceof Function) {
    try {
      result = errOrFunc()
      isError = false
      return {
        isError,
        result,
      }
    } catch (e) {
      isError = true
      error = e as E // it is lie
    }
  } else {
    isError = true
    error = errOrFunc
  }
  let message: string
  if (error instanceof Object && typeof (error as any).message === 'string') {
    message = (error as any).message
  } else if (typeof error === 'string') {
    message = error
  } else {
    message = unknownErrorMessage
  }
  return {
    isError,
    error,
    message,
  }
}

export class CausedError extends Error {
  public readonly cause?: unknown
  constructor(e: unknown) {
    const { message, error } = convertError(e)
    super(message)
    if (e !== error) {
      this.cause = error
    }
  }
}
