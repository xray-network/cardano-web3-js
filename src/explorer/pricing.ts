import PricingClient from "cardano-pricing-client"
import * as T from "../types"

export default (baseUrl: string, headers?: T.Headers): ReturnType<typeof PricingClient> => {
  return PricingClient(baseUrl, headers)
}
