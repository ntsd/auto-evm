<script lang="ts">
	import { removeSchedule, schedulesStore, updateSchedule } from '../../stores/schedulesStore';
	import { addToastMessage } from '../../stores/toastStore';
	import type { Schedule } from '../../types';
	import ScheduleModal from './ScheduleModal.svelte';

	function toggleEnabledHandler(schedule: Schedule) {
		updateSchedule(schedule);
		addToastMessage(`${schedule.enabled ? 'Enabled' : 'Disabled'} ${schedule.name}`);
	}
</script>

<div class="overflow-x-auto">
	<table class="table w-full table-compact">
		<thead>
			<tr>
				<th>Enabled</th>
				<th>Name</th>
				<th>Cron</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#each $schedulesStore as schedule}
				<tr>
					<td
						><input
							type="checkbox"
							class="toggle toggle-primary"
							bind:checked={schedule.enabled}
							on:change={() => {
								toggleEnabledHandler(schedule);
							}}
						/></td
					>
					<td>{schedule.name}</td>
					<td>{schedule.cron}</td>
					<td>
						<ScheduleModal isEdit={true} {schedule} />
						<button
							class="btn btn-accent"
							on:click={() => {
								removeSchedule(schedule.id);
							}}>Delete</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
