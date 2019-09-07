import kokoro from "kokoro-io";
import {machineId} from 'node-machine-id';

global.kokoro = kokoro;
global.machineId = machineId;
