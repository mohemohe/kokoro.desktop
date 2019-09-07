import kokoro from "kokoro-io";
import {machineId} from 'node-machine-id';

declare global {
	namespace NodeJS {
		export interface Global {
			kokoro: typeof kokoro;
			machineId: typeof machineId;
		}
	}
}
