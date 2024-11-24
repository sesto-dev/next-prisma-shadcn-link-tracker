import DeviceDetector from 'device-detector-js'
import { Headers } from 'next/dist/compiled/@edge-runtime/primitives'
import { UAParser } from 'ua-parser-js'

interface ExtractedData {
   userAgent: {
      browser: string
      os: string
      device: string
   }
   device: DeviceDetector.DeviceDetectorResult | null
}

export function extractRequestData(headers: Headers): ExtractedData {
   // Parse User-Agent
   const uaString = headers.get('user-agent') || ''

   // UA Parser
   const parser = new UAParser(uaString)
   const result = parser.getResult()

   // Device Detection
   const deviceDetector = new DeviceDetector()
   const device = deviceDetector.parse(uaString)

   return {
      userAgent: {
         browser: result.browser.name || 'Unknown',
         os: result.os.name || 'Unknown',
         device: result.device.type || 'Unknown',
      },
      device,
   }
}
