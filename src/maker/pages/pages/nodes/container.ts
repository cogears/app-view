import { ContainerOptions } from "types";
import { AppActions } from '@/index'

export const key = 'container'
export const label = '容器'
export const state = {
    visible: false,
    data: {
        direction: 'row',
        align: 'left',
    }
}
export const editor: ContainerOptions = {
    direction: 'column',
    children: [
        {
            type: 'form-field', formField: {
                label: '方向',
                align: 'left',
                content: {
                    type: 'select', select: {
                        name: 'form.binding.container.data.direction',
                        source: [
                            { key: 'row', label: '水平' },
                            { key: 'column', label: '垂直' }
                        ],
                        onChanged: [
                            { name: AppActions.ACTION_SUBMIT_FORM, data: [] }
                        ]
                    }
                }
            }
        },
        {
            type: 'form-field', formField: {
                label: '对齐',
                align: 'left',
                content: {
                    type: 'select', select: {
                        name: 'form.binding.container.data.align',
                        source: [
                            { key: 'left', label: '左' },
                            { key: 'center', label: '居中' },
                            { key: 'right', label: '右' },
                        ],
                        onChanged: [
                            { name: AppActions.ACTION_SUBMIT_FORM, data: [] }
                        ]
                    }
                }
            }
        }
    ],
}