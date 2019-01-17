const errors = require('./index')

const ERRORS = {
  InvalidSignature: { restCode: 1, message: 'Invalid Signature', statusCode: 403 },
  InvalidMerchantCode: { restCode: 2, message: 'Invalid Merchant Code', statusCode: 403 },
  InvalidVerificationCode: { restCode: 11, message: 'Invalid verification code', statusCode: 400 },
  VerificationCodeOvertime: { restCode: 12, message: 'Verification code overtime', statusCode: 400 },
  InvalidMobile: { restCode: 13, message: 'Invalid mobile', statusCode: 400 },
  // for nexmo
  NexmoThrottled: { restCode: 101, message: 'Throttled', statusCode: 400 },
  NexmoMissingParams: { restCode: 102, message: 'Missing Params', statusCode: 400 },
  NexmoInvalidParams: { restCode: 103, message: 'Invalid Params', statusCode: 400 },
  NexmoInvalidCredentials: { restCode: 104, message: 'Invalid Credentials', statusCode: 400 },
  NexmoInvalidMessage: { restCode: 106, message: 'Invalid Message', statusCode: 400 },
  NexmoNumberBarred: { restCode: 107, message: 'Number Barred', statusCode: 400 },
  NexmoAccountBarred: { restCode: 108, message: 'Account Barred', statusCode: 400 },
  NexmoQuotaExceeded: { restCode: 109, message: 'Quota Exceeded', statusCode: 400 },
  NexmoMessageTooLong: { restCode: 112, message: 'Message Too Long', statusCode: 400 },
  NexmoCommunicationFailed: { restCode: 113, message: 'Communication Failed', statusCode: 400 },
  NexmoIllegalSenderAddress: { restCode: 115, message: 'Illegal Sender Address - rejected', statusCode: 400 },
  // end

}

errors.register(ERRORS)
