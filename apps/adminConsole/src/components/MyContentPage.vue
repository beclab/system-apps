<template>
	<div class="my-content-page-header-extra">
		<slot name="extra"></slot>
	</div>
	<bt-scroll-area class="my-scroll-area-wrapper">
		<div>
			<slot></slot>
		</div>
	</bt-scroll-area>
</template>
<style lang="scss" scoped>
.my-content-page-header-extra {
	position: absolute;
	top: 0;
	right: 20px;
	height: $content-header-height;
	z-index: 2;
	display: flex;
	align-items: center;
}
.my-scroll-area-wrapper {
	height: calc(100vh - #{$content-header-height});
	margin-top: $content-header-height;
	background: $background-6;

	& > ::v-deep(.q-scrollarea__container) {
		min-width: 0px;
		overflow-x: hidden;
	}

	& > ::v-deep(.q-scrollarea__container > .q-scrollarea__content) {
		min-width: 0px;
		width: 100% !important;
	}
}
</style>
