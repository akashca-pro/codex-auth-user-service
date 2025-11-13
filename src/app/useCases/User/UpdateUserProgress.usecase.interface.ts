import { ResponseDTO } from "@/domain/dtos/Response";
import { UpdateUserProgressRequest } from "@akashcapro/codex-shared-utils";

export interface IUpdateUserProgressUsecase {
    execute(req : UpdateUserProgressRequest) : Promise<ResponseDTO>
}