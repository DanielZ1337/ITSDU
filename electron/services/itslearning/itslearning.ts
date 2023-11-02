const ITSLEARNING_SUBDOMAIN = 'sdu'
const ITSLEARNING_DOMAIN = 'itslearning.com'

export const GET_ITSLEARNING_URL = (subdomain: string) => `https://${subdomain}.${ITSLEARNING_DOMAIN}`

export const ITSLEARNING_URL = GET_ITSLEARNING_URL(ITSLEARNING_SUBDOMAIN)