import {
	persist,
	createIndexedDBStorage,
	GCMEncryption,
	createEncryptionStorage
} from '@macfja/svelte-persistent-store';
import { get, writable } from 'svelte/store';
import type { Schedule } from '../types';
import { IntervalBasedCronScheduler, parseCronExpression } from '@hotcode/cron-schedule';
import { callSmartContract } from '$lib/evmCall';
import { getWallet } from './walletsStore';
import { getNetwork } from './networksStore';
import { getContract } from './contractsStore';
import { addToastMessage } from './toastStore';
import ProcessingQueue from '../lib/processingQueue';
import { sleep } from '$lib/sleep';
import { generateRandomInteger } from '$lib/random';

const scheduler = new IntervalBasedCronScheduler(10 * 1000); // interval every 10 seconds
const schedulerTaskId: { [id: string]: number } = {};
const schedulerCallQueue = new ProcessingQueue<void>();

export let schedulesStore = writable<Schedule[]>([]);

export function unlockSchedulesStore(hexPassword: string) {
	schedulesStore = persist(
		writable<Schedule[]>([]),
		createEncryptionStorage(createIndexedDBStorage(), new GCMEncryption(hexPassword)),
		'calls'
	);
}

get(schedulesStore).forEach((s) => {
	const taskId = newScheduleTask(s);
	schedulerTaskId[s.id] = taskId;
});

function newScheduleTask(schedule: Schedule): number {
	const cron = parseCronExpression(schedule.cron);
	const scheduleId = schedule.id;

	return scheduler.registerTask(
		cron,
		() => {
			// get schedule againt for the updated one
			const schedule = getSchedule(scheduleId);
			if (!schedule) {
				return;
			}

			// skip if schedule not enabled
			if (!schedule.enabled) return;

			console.log(`running schedule ${schedule.name}`);

			const wallet = getWallet(schedule.walletAddress);
			if (!wallet) {
				return;
			}

			const contract = getContract(schedule.contractAddress);
			if (!contract) {
				return;
			}

			const network = getNetwork(contract.chainId);
			if (!network) {
				return;
			}

			schedulerCallQueue.enqueue(async () => {
				try {
					const receipt = await callSmartContract(
						wallet,
						schedule.walletPassword,
						network,
						contract,
						schedule.hexData,
						schedule.gasLimit
					);
					const msg = `schedule ${schedule.name} status: ${receipt.status}`;
					console.log(msg);
					addToastMessage(msg, 'success');

					await sleep(generateRandomInteger(10, 30) * 1000); // sleep 10 - 30 seconds before the next queue
				} catch (e) {
					const errMsg = `schedule ${schedule.name} error: ${e}`;
					console.error(errMsg);
					addToastMessage(errMsg, 'error');
				}
			});
		},
		{
			isOneTimeTask: false,
			errorHandler: (e) => {
				console.error(e);
				addToastMessage(`schedule ${schedule.name} error: ${e}`);
			}
		}
	);
}

export function addSchedule(
	scheduleName: string,
	walletAddress: string,
	walletPassword: string,
	contractAddress: string,
	hexData: string,
	gasLimit: number,
	cron: string
) {
	const newSchedule: Schedule = {
		id: crypto.randomUUID(),
		name: scheduleName,
		walletAddress,
		walletPassword,
		contractAddress,
		hexData,
		gasLimit,
		cron,
		enabled: true
	};

	const taskId = newScheduleTask(newSchedule);
	schedulerTaskId[newSchedule.id] = taskId;

	schedulesStore.update((s) => [...s, newSchedule]);
}

export function updateSchedule(newSchedule: Schedule) {
	return schedulesStore.update((schedules) =>
		schedules.map((c) => {
			if (c.id === newSchedule.id) {
				return newSchedule;
			}
			return c;
		})
	);
}

export function getSchedule(id: string) {
	return get(schedulesStore).find((s) => s.id === id);
}

export function removeSchedule(id: string) {
	schedulesStore.update((schedules) => {
		return schedules.filter((s) => s.id !== id);
	});

	scheduler.unregisterTask(schedulerTaskId[id]);
}
