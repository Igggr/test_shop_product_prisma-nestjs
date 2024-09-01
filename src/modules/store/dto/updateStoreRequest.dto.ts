import { PartialType } from "@nestjs/swagger";
import { CreateStoreRequestDTO } from "./createStoreRequest.dto";

export class UpdateStoreRequestDTO extends PartialType(CreateStoreRequestDTO) {}