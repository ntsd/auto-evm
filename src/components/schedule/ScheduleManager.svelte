<script lang="ts">
	import AddScheduleModal from './AddScheduleModal.svelte';
	import ScheduleList from './ScheduleList.svelte';
</script>

<div class="p-4 space-y-4">
	<div class="flex justify-between">
		<h2 class="text-2xl mb-4">Schedules</h2>
		<label for="add-schedule" class="btn btn-primary">Add Schedule</label>
	</div>
	<AddScheduleModal />
	<ScheduleList />
</div>
