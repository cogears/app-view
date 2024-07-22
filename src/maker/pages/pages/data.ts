import { NodeOptions, Option, SceneOptions } from "types";
import nodes from './nodes';

interface State {
    nodeTypes: Option<string>[],
    form: {
        type: string,
        binding: any,
    }
}

const scene: SceneOptions<State> = {
    state: {
        nodeTypes: Object.values(nodes).map(item => ({ key: item.key, label: item.label })),
        form: {
            type: '',
            binding: {
                [nodes.container.key]: nodes.container.state,
                [nodes.text.key]: nodes.text.state,
            },
        }
    },
    view: {
        type: 'form', style: { padding: 20 }, form: {
            direction: 'column',
            children: [
                {
                    type: 'form-field', formField: {
                        label: '类型',
                        align: 'left',
                        content: {
                            type: 'select', select: {
                                name: 'form.type', source: 'nodeTypes', onChanged: [
                                    { name: 'update-node-type', data: [] }
                                ]
                            }
                        }
                    }
                },
                ...Object.values(nodes).map(item => ({
                    type: 'container', container: item.editor, visible: `form.binding.${item.key}.visible`
                }) as NodeOptions)
            ],
            onSubmit: [
                { name: 'submit-form', data: [] }
            ]
        }
    },
    controllers: [
        {
            name: 'update-node-type', async execute(_context, _data, state) {
                for (let key of Object.keys(nodes)) {
                    state.form.binding[key].visible = key == state.form.type
                }
            },
        },
        {
            name: 'submit-form', async execute(_context, _data, state) {
                console.info(state.form.type, state.form.binding[state.form.type].data)
            },
        },
    ],
}

export default scene