<script setup lang='ts'>
const props = defineProps<{ url: string | undefined }>()
const emits = defineEmits<{ (e: 'remove', url: string | undefined): void }>()

const deleteImg = (): void => {
	emits('remove', props.url)
}
</script>

<template>
	<div class='image-container'>
		<img class='image' :src='url' alt='' />
		<div @click='deleteImg' class='del-icon'></div>
	</div>
</template>

<style scoped lang='scss'>
.image-container {
	margin: 10px;
	display: inline-block;
	position: relative;
}

.image {
	border: #cdd0d6 dashed 1px;
	width: 148px;
	height: 148px;
	border-radius: 6px;
}

.del-icon {
	position: absolute;
	width: 15px;
	height: 15px;
	border: 1px solid #cdd0d6;
	border-radius: 50%;
	top: 5px;
	right: 5px;
	transform: rotate(45deg);
	cursor: pointer;
}

.del-icon::before {
	display: block;
	position: absolute;
	content: "";
	width: 10px;
	height: 1px;
	background-color: #cdd0d6;
	top: 50%;
	left: 50%;
	transform: translate3d(-50%, -50%, 0);

}

.del-icon::after {
	display: block;
	position: absolute;
	content: "";
	width: 1px;
	height: 10px;
	background-color: #cdd0d6;
	top: 50%;
	left: 50%;
	transform: translate3d(-50%, -50%, 0);
}
</style>