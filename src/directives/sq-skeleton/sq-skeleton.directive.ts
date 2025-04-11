import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core'

/**
 * Angular directive for creating skeleton loading placeholders.
 *
 * This directive generates animated placeholder elements that mimic the structure of content
 * while it's being loaded. It's particularly useful for improving perceived performance
 * during data fetching operations.
 *
 * @example
 * <!-- Basic usage -->
 * <div *skeleton="isLoading">
 *   Actual content to be displayed when not loading
 * </div>
 *
 * @example
 * <!-- Customized skeleton -->
 * <div 
 *   *skeleton="isLoading"
 *   skeletonWidth="200px"
 *   skeletonHeight="50px"
 *   skeletonRepeat="3"
 *   skeletonDelay="100"
 *   skeletonMargin="10px">
 *   Content with custom skeleton
 * </div>
 */
@Directive({
	selector: '[skeleton]',
})
export class SqSkeletonDirective implements OnInit {
	/**
	 * Controls whether the skeleton should be displayed.
	 * When true, shows skeleton placeholders when false, shows the actual content.
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
	 * Creates an instance of SqSkeletonDirective.
	 * @param templateRef - Reference to the template where the directive is applied.
	 * @param viewContainer - Container where the skeleton or content will be rendered.
	 */
	constructor(
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
	) { }

	/**
	 * Angular lifecycle hook that initializes the directive.
	 * Determines whether to show skeleton placeholders or actual content based on input.
	 */
	ngOnInit() {
		if (this.skeleton) {
			this.showSkeleton()
		} else {
			this.showContent()
		}
	}

	/**
	 * Creates and displays skeleton placeholder elements.
	 * Clears any existing content and generates new skeleton elements based on configuration.
	 * @private
	 */
	private showSkeleton() {
		this.viewContainer.clear()

		for (let i = 0; i < this.skeletonRepeat; i++) {
			const skeletonElement = document.createElement('div')
			skeletonElement.className = 'skeleton'
			skeletonElement.style.width = this.skeletonWidth
			skeletonElement.style.height = this.skeletonHeight
			skeletonElement.style.margin = this.skeletonMargin

			if (this.skeletonDelay && i > 0) {
				skeletonElement.style.animationDelay = `${i * this.skeletonDelay}ms`
			}

			this.viewContainer.element.nativeElement.parentNode.insertBefore(
				skeletonElement,
				this.viewContainer.element.nativeElement,
			)
		}
	}

	/**
	 * Displays the actual content by creating an embedded view from the template.
	 * Clears any existing skeleton placeholders before showing the content.
	 * @private
	 */
	private showContent() {
		this.viewContainer.clear()
		this.viewContainer.createEmbeddedView(this.templateRef)
	}
}