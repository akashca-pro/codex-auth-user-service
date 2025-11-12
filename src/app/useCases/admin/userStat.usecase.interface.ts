import { ResponseDTO } from "@/domain/dtos/Response";

export interface IUserStatUseCase {
    execute() : Promise<ResponseDTO>
}