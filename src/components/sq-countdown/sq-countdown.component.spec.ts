import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SqCountdownComponent } from './sq-countdown.component'
import { CountdownEvent, CountdownStatus } from 'ngx-countdown'

describe('SqCountdownComponent', () => {
  let component: SqCountdownComponent
  let fixture: ComponentFixture<SqCountdownComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqCountdownComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SqCountdownComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should emit startEmitter when countdown starts', () => {
    spyOn(component.startEmitter, 'emit')

    const event: CountdownEvent = { action: 'start', status: CountdownStatus.ing, left: 1000, text: '16:40' }
    component.eventMap(event)

    expect(component.startEmitter.emit).toHaveBeenCalledWith({ left: 1000 })
  })

  it('should emit notifyEmitter when countdown notify event is triggered', () => {
    spyOn(component.notifyEmitter, 'emit')

    const event: CountdownEvent = { action: 'notify', status: CountdownStatus.ing, left: 500, text: '08:20' }
    component.eventMap(event)

    expect(component.notifyEmitter.emit).toHaveBeenCalledWith({ left: 500 })
  })

  it('should emit doneEmitter when countdown ends', () => {
    spyOn(component.doneEmitter, 'emit')

    const event: CountdownEvent = { action: 'done', status: CountdownStatus.done, left: 0, text: '00:00' }
    component.eventMap(event)

    expect(component.doneEmitter.emit).toHaveBeenCalledWith({ left: 0 })
  })

  it('should not emit any event if action is invalid', () => {
    spyOn(component.startEmitter, 'emit')
    spyOn(component.notifyEmitter, 'emit')
    spyOn(component.doneEmitter, 'emit')

    const event: CountdownEvent = { action: 'stop', status: CountdownStatus.stop, left: 100, text: '01:40' }
    component.eventMap(event)

    expect(component.startEmitter.emit).not.toHaveBeenCalled()
    expect(component.notifyEmitter.emit).not.toHaveBeenCalled()
    expect(component.doneEmitter.emit).not.toHaveBeenCalled()
  })

  it('should emit correct event based on action and status', () => {
    spyOn(component.startEmitter, 'emit')
    spyOn(component.notifyEmitter, 'emit')
    spyOn(component.doneEmitter, 'emit')

    // Test for 'start' action with CountdownStatus.ing
    let event: CountdownEvent = { action: 'start', status: CountdownStatus.ing, left: 1000, text: '16:40' }
    component.eventMap(event)
    expect(component.startEmitter.emit).toHaveBeenCalledWith({ left: 1000 })

    // Test for 'notify' action with CountdownStatus.ing
    event = { action: 'notify', status: CountdownStatus.ing, left: 500, text: '08:20' }
    component.eventMap(event)
    expect(component.notifyEmitter.emit).toHaveBeenCalledWith({ left: 500 })

    // Test for 'done' action with CountdownStatus.done
    event = { action: 'done', status: CountdownStatus.done, left: 0, text: '00:00' }
    component.eventMap(event)
    expect(component.doneEmitter.emit).toHaveBeenCalledWith({ left: 0 })
  })
})
