import { NCPClient } from "node-sens"

const ncp = new NCPClient({
  phoneNumber: process.env.PHONENUM as string,
  serviceId: process.env.SERVICE_KEY as string,
  secretKey: process.env.SECRET_KEY as string,
  accessKey: process.env.ACCESS_KEY as string,
})

export default ncp
