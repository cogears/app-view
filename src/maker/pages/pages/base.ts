import { SceneOptions } from 'types'

interface State {
    form: {
        name: string,
        path: string,
    }
}

const scene: SceneOptions<State> = {
    state: {
        form: {
            name: '',
            path: ''
        }
    },
    view: {
        type: 'form', style: { padding: 20 }, form: {
            direction: 'column',
            children: [
                {
                    type: 'form-field', formField: {
                        label: '名称',
                        align: 'left',
                        content: { type: 'input', input: { name: 'form.name' } }
                    }
                },
                {
                    type: 'form-field', formField: {
                        label: '路径',
                        align: 'left',
                        content: { type: 'input', input: { name: 'form.path' } }
                    }
                }
            ],
            onSubmit: []
        }
    },
    controllers: []
}

export default scene