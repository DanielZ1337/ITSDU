// const ITSLEARNING_SUBDOMAIN = 'sdu'
import { ItslearningService } from './itslearning-service'

const ITSLEARNING_DOMAIN = 'itslearning.com'

export const GET_ITSLEARNING_URL = (subdomain: string) => `https://${subdomain}.${ITSLEARNING_DOMAIN}`

export const ITSLEARNING_URL = () => ItslearningService.getInstance().getBaseUrl()

