import { dbErrorCounter, dbQueryDuration } from "@/config/metrics/metrics";

export const dbMetricsCollector = (
    operation : string,
    status : 'success' | 'error',
    startTime : number
) => {

    // Observe successfull duration.
    dbQueryDuration.observe({ operation, status }, Date.now() - startTime);

    // increment the error counter.
    if(status === 'error'){
        dbErrorCounter.inc({ operation });
    }

}