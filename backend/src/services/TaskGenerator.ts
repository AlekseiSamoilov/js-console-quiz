import { IBlockData } from "../types";

export class TaskGenerator {
    private blockData: IBlockData;

    constructor(blockData: IBlockData) {
        this.blockData = blockData
    }
}