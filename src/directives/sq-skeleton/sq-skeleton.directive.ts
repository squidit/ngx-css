import { Directive, Input, OnChanges, Renderer2, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core'

/**
 * Angular directive for creating customizable skeleton loading placeholders.
 * 
 * This directive dynamically generates animated skeleton elements while content is loading,
 * providing better user experience during data fetching operations. It supports multiple
 * skeletons with wave animation effects.
 *
 * @example
 * <!-- Basic usage -->
 * <div *skeleton="isLoading">
 *   Actual content to be displayed when not loading
 * </div>
 *
 * @example
 * <!-- Customized skeleton with multiple items -->
 * <div 
 *   *skeleton="loading; width: '200px'; height: '50px'">
 *   Content with custom skeleton
 * </div>
 */
@Directive({
	selector: '[skeleton]'
})
export class AppSkeletonDirective implements OnChanges {
	/**
	 * Controls whether the skeleton should be displayed.
	 * When true, shows skeleton placeholders; when false, shows the actual content.
	 */
	@Input() skeleton = false
	/**
	 * Width of each skeleton placeholder.
	 * @default '100%'
	 */
	@Input() skeletonWidth = '100%'

	/**
	 * Height of each skeleton placeholder.
	 * @default '100%'
	 */
	@Input() skeletonHeight = '100%'

	/**
	 * Number of skeleton placeholders to display.
	 * Useful for creating multiple placeholder items.
	 * @default 1
	 */
	@Input() skeletonRepeat = 1

	/**
	 * Delay between animations of subsequent skeleton placeholders (in milliseconds).
	 * Creates a wave effect when multiple placeholders are used.
	 * @default 0 (no delay)
	 */
	@Input() skeletonDelay = 0

	/**
	 * Margin around each skeleton placeholder.
	 * @default '0'
	 */
	@Input() skeletonMargin = '0'

	/**
	 * Array to hold references to the created skeleton elements.
	 * This is used to manage the lifecycle of the skeleton elements.
	 */
	private skeletonElements: HTMLElement[] = []

	/**
	 * Creates an instance of SqSkeletonDirective.
	 * @param templateRef - Reference to the template where the directive is applied.
	 * @param viewContainer - Container where the skeleton or content will be rendered.
	 * @param renderer - Renderer2 service for manipulating the DOM.
	 */
	constructor(
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private renderer: Renderer2
	) { }

	/**
	 * Angular lifecycle hook that responds to changes in input properties.
	 * Determines whether to show skeleton placeholders or actual content based on input.
	 */
	ngOnChanges(changes: SimpleChanges): void {
		if (
			changes['skeletonn'] ||
			changes['skeletonRepeat'] ||
			changes['skeletonWidth'] ||
			changes['skeletonHeight']
		) {
			this.updateView()
		}
	}

	/**
	 * Updates the view based on current state.
	 * Shows either skeleton placeholders or actual content.
	 * @private
	 */
	private updateView(): void {
		this.clearSkeletons()

		if (this.skeleton) {
			this.createSkeletons()
		} else {
			this.showContent()
		}
	}

	/**
	 * Creates and displays skeleton placeholder elements.
	 * Generates multiple skeletons if skeletonRepeat > 1.
	 * @private
	 */
	private createSkeletons(): void {
		this.viewContainer.clear()

		for (let i = 0; i < this.skeletonRepeat; i++) {
			const skeletonElement = this.renderer.createElement('div')
			this.renderer.addClass(skeletonElement, 'skeleton')

			this.renderer.setStyle(skeletonElement, 'width', this.skeletonWidth)
			this.renderer.setStyle(skeletonElement, 'height', this.skeletonHeight)
			this.renderer.setStyle(skeletonElement, 'margin', this.skeletonMargin)

			if (this.skeletonDelay && i > 0) {
				this.renderer.setStyle(
					skeletonElement,
					'animation-delay',
					`${i * this.skeletonDelay}ms`
				)
			}

			this.renderer.insertBefore(
				this.viewContainer.element.nativeElement.parentNode,
				skeletonElement,
				this.viewContainer.element.nativeElement
			)

			this.skeletonElements.push(skeletonElement)
		}
	}

	/**
	 * Displays the actual content by creating an embedded view from the template.
	 * @private
	 */
	private showContent(): void {
		this.viewContainer.clear()
		this.viewContainer.createEmbeddedView(this.templateRef)
	}

	/**
	 * Clears all skeleton elements from the DOM.
	 * @private
	 */
	private clearSkeletons(): void {
		this.skeletonElements.forEach(element => {
			if (element.parentNode) {
				this.renderer.removeChild(element.parentNode, element)
			}
		})
		this.skeletonElements = []
	}
}
