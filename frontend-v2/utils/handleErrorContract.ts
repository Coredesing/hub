export const handleErrMsg = (err: any) => {
  const message = err?.data?.message || ''
  if (message.includes('POOL::ENDED')) {
    return 'The sale has ended.'
  }
  if (message.includes('POOL:PURCHASE_AMOUNT_EXCEED_ALLOWANCE')) {
    return 'The number of Tickets you want to buy is greater than the number you can buy. Please try again.'
  }
  if (message.includes('POOL::AMOUNT_MUST_GREATER_THAN_CLAIMED')) {
    return 'You have already claimed.'
  }
  if (message.includes('transfer amount exceeds balance')) {
    return 'Not enough balance.'
  }
  if (message.includes('User has already claimed')) {
    return 'User has already claimed.'
  }
  if (message.includes('Event::ENDED')) {
    return 'The event has ended.'
  }
  if (message.includes('NFTBox: Rate limit exceeded')) {
    return 'You have reached the limit of buying boxes.'
  }
  return message || err.message
}
