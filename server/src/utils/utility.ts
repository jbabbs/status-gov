
export function sinceParamToInterval(sinceParam: string) {
  let latencyInterval;

  switch(sinceParam) {
    case '10minutes':
      latencyInterval = '10 minutes';
      break;
    case '24H':
      latencyInterval = '24 hours';
      break;
    case '1WEEK':
      latencyInterval = '7 days';
      break;
    default:
      latencyInterval = '2 minutes';
  }

  return latencyInterval;
}
