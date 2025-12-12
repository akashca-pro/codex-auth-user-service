import { 
    RemoveUserRequest, 
    SubmissionServiceClient,
    UpdateCountryRequest 
} from "@akashcapro/codex-shared-utils/dist/proto/compiled/gateway/problem";
import { GrpcBaseService } from "./GrpcBaseService";
import { config } from "@/config";
import { credentials } from "@grpc/grpc-js";
import { Empty } from "@akashcapro/codex-shared-utils/dist/proto/compiled/google/protobuf/empty";


/**
 * Class implementing the submission grpc client call.
 * 
 * @class
 * @extends {GrpcBaseService}
 */
export class GrpcSubmissionService extends GrpcBaseService {

    #_client : SubmissionServiceClient

    constructor(){
        super();
        this.#_client = new SubmissionServiceClient(
            config.GRPC_PROBLEM_SERVICE_URL!,
            credentials.createInsecure()
        )
    }

    updateCountryInLeaderboard = async(
        request : UpdateCountryRequest
    ) : Promise<Empty> => {
        return this.grpcCall(
            this.#_client.updateCountryInLeaderboard.bind(this.#_client),
            request
        )
    }

    removeUserInLeaderboard = async(
        request : RemoveUserRequest
    ) : Promise<Empty> => {
        return this.grpcCall(
            this.#_client.removeUserInLeaderboard.bind(this.#_client),
            request
        )
    }
 
}

export default new GrpcSubmissionService();