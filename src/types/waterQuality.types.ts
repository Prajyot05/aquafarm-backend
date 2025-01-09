export interface WaterQualityRequestBody {
    tds: number
    pH: number
    temperature: number
    orp: number
    recordedAt: Date
}
