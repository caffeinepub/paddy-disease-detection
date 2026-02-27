import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Disease {
    fertilizers: Array<string>;
    severityLevel: string;
    name: string;
    treatment: string;
    description: string;
    quickActions: Array<string>;
    yieldImpact: string;
    seasonalAdvice: string;
    preventionTips: Array<string>;
}
export interface backendInterface {
    getAllDiseases(): Promise<Array<[number, Disease]>>;
    getDisease(diseaseIndex: number): Promise<Disease>;
    simulateDetection(_image: string, diseaseIndex: number): Promise<number | null>;
}
