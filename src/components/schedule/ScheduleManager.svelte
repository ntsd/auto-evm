<script lang="ts">
	import ScheduleModal from './ScheduleModal.svelte';
	import ScheduleList from './ScheduleList.svelte';
</script>

<div class="p-4 space-y-4">
	<div class="flex flex-col lg:flex-row justify-between">
		<h2 class="text-2xl mb-4">Schedules</h2>
		<ScheduleModal />
	</div>
	<ScheduleList />
</div>
