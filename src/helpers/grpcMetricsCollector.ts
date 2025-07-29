import { grpcLatency, grpcRequestCounter } from "@/config/metrics/metrics";

export const grpcMetricsCollector = (
    method : string,
    status : string,
    startTime : number

) => {
    if(status === undefined) status = 'success'
    grpcRequestCounter.inc({ method , status });
    grpcLatency.observe(
        {method, status},
        Date.now() - startTime
    )

}