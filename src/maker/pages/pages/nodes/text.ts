import { ContainerOptions } from "types";
import { ColorTypes } from '../options'
import { AppActions } from '@/index'

export const key = 'text'
export const label = '文字'
export const state = {
    visible: false,
    data: {
        label: '',
        color: '',
    }
}
export const editor: ContainerOptions = {
    direction: 'column',
    children: [
        {
            type: 'form-field', formField: {
                label: '内容',
                align: 'left',
                content: {
                    type: 'input', input: {
                        name: 'form.binding.text.data.label',
                        onChanged: [
                            { name: AppActions.ACTION_SUBMIT_FORM, data: [] }
                        ]
                    }
                }
            }
        },
        {
            type: 'form-field', formField: {
                label: '颜色',
                align: 'left',
                content: {
                    type: 'select', select: {
                        name: 'form.binding.text.data.color',
                        source: ColorTypes,
                        onChanged: [
                            { name: AppActions.ACTION_SUBMIT_FORM, data: [] }
                        ]
                    }
                }
            }
        },
    ]
}