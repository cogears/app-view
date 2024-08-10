import { Option, SceneOptions } from "types";
import { BoolTypes } from "./options";

interface State {
    boolTypes: Option<boolean>[],
    form: {
        name: string,
        style: {
            width: string,
            height: string,
            padding: string,
            full: boolean,
            border: boolean,
        }

    }
}

const scene: SceneOptions<State> = {
    state: {
        boolTypes: BoolTypes,
        form: {
            name: '',
            style: {
                width: '',
                height: '',
                padding: '',
                full: false,
                border: false,
            }
        }
    },
    view: {
        type: 'container', style: { padding: 20 }, container: {
            direction: 'column',
            children: [
                {
                    type: 'form-field', formField: {
                        label: '名称',
                        align: 'left',
                        content: {
                            type: 'input', input: { name: 'form.name' }
                        }
                    }
                },
                {
                    type: 'form-field', formField: {
                        label: '宽度',
                        align: 'left',
                        content: {
                            type: 'input', input: { name: 'form.style.width', type: 'number' }
                        }
                    }
                },
                {
                    type: 'form-field', formField: {
                        label: '高度',
                        align: 'left',
                        content: {
                            type: 'input', input: { name: 'form.style.height', type: 'number' }
                        }
                    }
                },
                {
                    type: 'form-field', formField: {
                        label: '内边距',
                        align: 'left',
                        content: {
                            type: 'input', input: { name: 'form.style.padding', type: 'number' }
                        }
                    }
                },
                {
                    type: 'form-field', formField: {
                        label: '显示边框',
                        align: 'left',
                        content: {
                            type: 'radio', radio: { name: 'form.style.border', source: 'boolTypes' }
                        }
                    }
                },
                {
                    type: 'form-field', formField: {
                        label: '空间平铺',
                        align: 'left',
                        content: {
                            type: 'radio', radio: { name: 'form.style.full', source: 'boolTypes' }
                        }
                    }
                }
            ],
        }
    },
    controllers: [],
}

export default scene