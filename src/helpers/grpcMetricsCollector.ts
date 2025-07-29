import { grpcLatency, grpcRequestCounter } from "@/config/metrics/metrics";

export const grpcMetricsCollector = (
    method : string,
    status : string,
    startTime : number

) => {
    grpcRequestCounter.inc({ method , status });
    grpcLatency.observe(
        {method, status},
        Date.now() - startTime
    )

}