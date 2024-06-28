import { Meta, StoryObj } from '@storybook/angular'
import { SqInputComponent } from './sq-input.component'

const meta: Meta<SqInputComponent> = {
    title: 'Example/SqInput',
    component: SqInputComponent,
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'text' },
        id: { control: 'text' },
        label: { control: 'text' },
        customClass: { control: 'text' },
        placeholder: { control: 'text' },
        externalError: { control: 'text' },
        externalIcon: { control: 'text' },
        value: { control: 'text' },
        timeToChange: { control: 'number' },
        errorSpan: { control: 'boolean' },
        disabled: { control: 'boolean' },
        readonly: { control: 'boolean' },
        required: { control: 'boolean' },
        useFormErrors: { control: 'boolean' },
        tooltipMessage: { control: 'text' },
        tooltipPlacement: {
            control: 'radio',
            options: ['center top', 'center bottom', 'left center', 'right center'],
        },
        tooltipColor: { control: 'color' },
        tooltipIcon: { control: 'text' },
        backgroundColor: { control: 'color' },
        borderColor: { control: 'color' },
        labelColor: { control: 'color' },
        type: {
            control: 'radio',
            options: ['text', 'email', 'hidden', 'password', 'tel', 'url', 'file'],
        },
        maxLength: { control: 'number' },
        pattern: { control: 'text' },
        inputMode: { control: 'text' },
    },
}

export default meta

type Story = StoryObj<SqInputComponent>

export const Default: Story = {
    args: {
        label: 'Example Input',
        placeholder: 'Enter text',
        value: '',
        disabled: false,
        readonly: false,
        required: false,
        tooltipMessage: 'This is a tooltip',
        tooltipPlacement: 'right center',
        type: 'text',
    }
}

export const WithError: Story = {
    args: {
        label: 'Example Input',
        placeholder: 'Enter text',
        value: '',
        disabled: false,
        readonly: false,
        required: true,
        externalError: 'This field is required',
    },
}

export const CustomColors: Story = {
    args: {
        label: 'Custom Colors',
        placeholder: 'Enter text',
        value: '',
        disabled: false,
        readonly: false,
        required: false,
        backgroundColor: '#f0f0f0',
        borderColor: '#ff5722',
        labelColor: '#007bff',
    },
}

export const Disabled: Story = {
    args: {
        label: 'Disabled Input',
        placeholder: 'Enter text',
        value: '',
        disabled: true,
        readonly: false,
        required: false,
    },
}

export const Readonly: Story = {
    args: {
        label: 'Readonly Input',
        placeholder: 'Enter text',
        value: 'Readonly value',
        disabled: false,
        readonly: true,
        required: false,
    },
}

export const WithIcon: Story = {
    args: {
        label: 'Input with Icon',
        placeholder: 'Enter text',
        value: '',
        disabled: false,
        readonly: false,
        required: false,
        externalIcon: 'info',
    },
}