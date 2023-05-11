<script lang="ts">
	import { removeSchedule, schedulesStore } from '../../stores/schedulesStore';
	import ScheduleModal from './ScheduleModal.svelte';
</script>

<div class="overflow-x-auto">
	<table class="table w-full table-compact">
		<thead>
			<tr>
				<th>Name</th>
				<th>Cron</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#each $schedulesStore as schedule}
				<tr>
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
