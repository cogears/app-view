import { SceneOptions, Option } from 'types'
import { AppActions } from '@/index'

interface State {
    form: {
        name: string,
        origin: string,
        validateEnable: boolean,
        validate: {
            key: string,
            value: string,
            error: string,
        },
        result: string,
    },
    enableSource: Option<boolean>[],
}

const scene: SceneOptions<State> = {
    input: 'domain.input',
    output: 'form',
    state: {
        form: {
            name: '',
            origin: '',
            validateEnable: false,
            validate: {
                key: '',
                value: '',
                error: '',
            },
            result: '',
        },
        enableSource: [
            { key: true, label: '是' },
            { key: false, label: '否' },
        ]
    },
    view: {
        style: { full: true, padding: 20 },
        type: 'form', form: {
            direction: 'column',
            children: [
                {
                    type: 'form-field', formField: {
                        label: '域名称',
                        name: 'form.name',
                        require: true,
                        content: {
                            type: 'input', input: { name: 'form.name' }
                        }
                    }
                },
                {
                    type: 'form-field', formField: {
                        label: '域环境',
                        name: 'form.origin',
                        require: true,
                        content: {
                            type: 'input', input: { name: 'form.origin' }
                        }
                    }
                },
                {
                    type: 'form-field', formField: {
                        label: '返回结果字段',
                        name: 'form.result',
                        require: false,
                        content: {
                            type: 'input', input: { name: 'form.result' }
                        }
                    }
                },
                {
                    type: 'form-field', formField: {
                        label: '是否验证结果',
                        content: {
                            type: "radio", radio: { name: 'form.validateEnable', source: 'enableSource' }
                        }
                    }
                },
                {
                    type: 'form-field', formField: {
                        label: '需验证字段',
                        content: {
                            type: 'input', input: { name: 'form.validate.key' }
                        }
                    },
                    visible: 'form.validateEnable',
                },
                {
                    type: 'form-field', formField: {
                        label: '验证标准值',
                        content: {
                            type: 'input', input: { name: 'form.validate.value' }
                        }
                    },
                    visible: 'form.validateEnable',
                },
                {
                    type: 'form-field', formField: {
                        label: '错误提示字段',
                        content: {
                            type: 'input', input: { name: 'form.validate.error' }
                        }
                    },
                    visible: 'form.validateEnable',
                },
                {
                    type: 'container', container: {
                        align: 'right',
                        children: [
                            {
                                type: 'button', button: {
                                    label: '保存修改', onClick: [
                                        { name: AppActions.ACTION_SUBMIT_FORM, data: [] }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ],
            onSubmit: [
                { name: 'save-domain', data: [] }
            ]
        }
    },
    controllers: [
        {
            name: 'start', async execute(_context, data, state) {
                let item = data[0]
                if (item) {
                    state.form.name = item.name
                    state.form.origin = item.origin
                    state.form.result = item.result
                    if (item.validate) {
                        state.form.validateEnable = true
                        state.form.validate = {
                            key: item.validate.key,
                            value: item.validate.value,
                            error: item.validate.error,
                        }
                    } else {
                        state.form.validateEnable = false
                        state.form.validate = { key: '', value: '', error: '' }
                    }
                }
            },
        },
    ],
    onStart: [
        { name: 'start', data: [] }
    ]
}

export default scene