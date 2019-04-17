describe('#temp', function() {
	it('#test', function() {
		Vue.use(VueSkeleton);
		Vue.component('Test', {
			template: '<div>template</div>',
			skeletonTemplate: '<div>skeletonTemplate</div>',
		});
		const app = new Vue({
			data() {
				return {
					showSkeleton: true,
				};
			},
			template: '<Test :skeleton-visible="showSkeleton"></Test>',
		});

		const vm = app.$mount(); 
		expect(vm.$el.textContent).to.contain('skeletonTemplate');

		// vm.showSkeleton = false;
		// expect(vm.$el.textContent).to.contain('template');
	});
});