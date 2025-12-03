import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostBinding,
  HostListener,
  inject,
  TemplateRef,
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import {
  SqToastInstance,
  SqToastDismissReason,
  SQ_TOAST_ICONS,
} from '../../interfaces/sq-toast.interface';

/**
 * Individual toast notification component.
 * Handles display, animations, and user interactions for a single toast.
 *
 * This component is created dynamically by SqToastService and should not
 * be used directly in templates.
 */
@Component({
  selector: 'sq-toast',
  templateUrl: './sq-toast.component.html',
  styleUrls: ['./sq-toast.component.scss'],
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SqToastComponent implements OnInit, OnDestroy {
  /**
   * Toast instance data.
   */
  @Input() toast!: SqToastInstance;

  /**
   * Event emitted when toast should be dismissed.
   */
  @Output() dismissed = new EventEmitter<SqToastDismissReason>();

  /**
   * Whether the toast is visible (for animations).
   */
  @HostBinding('class.visible') isVisible = false;

  /**
   * Whether the toast is being removed (exit animation).
   */
  @HostBinding('class.removing') isRemoving = false;

  /**
   * Change detector reference.
   */
  private cdr = inject(ChangeDetectorRef);

  /**
   * Subject for cleanup on destroy.
   */
  private destroy$ = new Subject<void>();

  /**
   * Timer subscription for auto-dismiss.
   */
  private timerPaused = false;

  /**
   * Remaining time when paused.
   */
  private remainingTime = 0;

  /**
   * Time when pause started.
   */
  private pauseStartTime = 0;

  /**
   * Current timer subscription.
   */
  private timerSubscription?: ReturnType<typeof setTimeout>;

  /**
   * Get the appropriate icon for this toast type.
   */
  get icon(): string {
    return this.toast.config.icon || SQ_TOAST_ICONS[this.toast.config.type];
  }

  /**
   * Get CSS classes based on toast type.
   */
  get typeClass(): string {
    return `toast-${this.toast.config.type}`;
  }

  /**
   * Get data-test attribute value.
   */
  get dataTestValue(): string {
    return this.toast.config.dataTest || `sq-toast-${this.toast.id}`;
  }

  /**
   * Get the message as a TemplateRef (when isTemplate is true).
   */
  get templateRef(): TemplateRef<any> | null {
    return this.toast.isTemplate ? (this.toast.message as TemplateRef<any>) : null;
  }

  /**
   * Lifecycle hook - initialize toast.
   */
  ngOnInit(): void {
    // Listen for programmatic dismiss requests
    this.toast.ref.onDismissRequest().pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.remove('manual');
    });

    // Trigger enter animation
    requestAnimationFrame(() => {
      this.isVisible = true;
      this.cdr.markForCheck();
    });

    // Start auto-dismiss timer if duration > 0
    if (this.toast.config.duration > 0) {
      this.remainingTime = this.toast.config.duration;
      this.startTimer();
    }
  }

  /**
   * Lifecycle hook - cleanup.
   */
  ngOnDestroy(): void {
    this.clearTimer();
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle click on the toast body.
   */
  @HostListener('click')
  onClick(): void {
    if (this.toast.config.dismissOnClick) {
      this.remove('manual');
    }
  }

  /**
   * Handle mouse enter - pause timer.
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.toast.config.pauseOnHover && this.toast.config.duration > 0) {
      this.pauseTimer();
    }
  }

  /**
   * Handle mouse leave - resume timer.
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.toast.config.pauseOnHover && this.toast.config.duration > 0 && this.timerPaused) {
      this.resumeTimer();
    }
  }

  /**
   * Handle close button click.
   */
  onCloseClick(event: Event): void {
    event.stopPropagation();
    this.remove('manual');
  }

  /**
   * Handle action button click.
   */
  onActionClick(event: Event): void {
    event.stopPropagation();
    
    if (this.toast.config.action?.callback) {
      this.toast.config.action.callback();
    }
    
    this.remove('action');
  }

  /**
   * Start the auto-dismiss timer.
   */
  private startTimer(): void {
    this.clearTimer();
    this.timerPaused = false;
    
    this.timerSubscription = setTimeout(() => {
      this.remove('timeout');
    }, this.remainingTime);
  }

  /**
   * Pause the timer.
   */
  private pauseTimer(): void {
    if (this.timerPaused) return;
    
    this.timerPaused = true;
    this.pauseStartTime = Date.now();
    this.clearTimer();
    
    // Calculate remaining time
    const elapsed = Date.now() - this.toast.createdAt;
    this.remainingTime = Math.max(0, this.toast.config.duration - elapsed);
  }

  /**
   * Resume the timer.
   */
  private resumeTimer(): void {
    if (!this.timerPaused) return;
    
    this.timerPaused = false;
    
    if (this.remainingTime > 0) {
      this.timerSubscription = setTimeout(() => {
        this.remove('timeout');
      }, this.remainingTime);
    }
  }

  /**
   * Clear the timer.
   */
  private clearTimer(): void {
    if (this.timerSubscription) {
      clearTimeout(this.timerSubscription);
      this.timerSubscription = undefined;
    }
  }

  /**
   * Remove the toast with exit animation.
   */
  private remove(reason: SqToastDismissReason): void {
    this.clearTimer();
    this.isRemoving = true;
    this.cdr.markForCheck();

    // Wait for exit animation
    setTimeout(() => {
      this.dismissed.emit(reason);
    }, 300);
  }
}

