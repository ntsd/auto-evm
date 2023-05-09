import {
	persist,
	createLocalStorage,
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

const scheduler = new IntervalBasedCronScheduler(10 * 1000); // interval every 10 seconds
const schedulerTaskId: { [id: string]: number } = {};
const schedulerCallQueue = new ProcessingQueue<void>();

export const schedulesStore = persist(
	writable<Schedule[]>([]),
	createEncryptionStorage(
		createLocalStorage(),
		new GCMEncryption('3a2f9500fc967cc784923f6876abbb3dcf64b8b94ad7dc8dd1cdfc002729c8f7')
	),
	'calls'
);

get(schedulesStore).forEach((s) => {
	const taskId = newScheduleTask(s);
	schedulerTaskId[s.id] = taskId;
});

function newScheduleTask(schedule: Schedule): number {
	const cron = parseCronExpression(schedule.cron);

	return scheduler.registerTask(
		cron,
		() => {
			console.log('running schedule', JSON.stringify(schedule));

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
		cron
	};

	const taskId = newScheduleTask(newSchedule);
	schedulerTaskId[newSchedule.id] = taskId;

	schedulesStore.update((s) => [...s, newSchedule]);
}

export function removeSchedule(id: string) {
	schedulesStore.update((schedules) => {
		return schedules.filter((s) => s.id !== id);
	});

	scheduler.unregisterTask(schedulerTaskId[id]);
}
